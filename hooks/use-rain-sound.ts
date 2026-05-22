"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Synthesises a calm rain ambience using the Web Audio API — no asset
 * download, works offline, respects the user's volume. Two pieces:
 *
 *  1. A looping white-noise buffer feeding a low-pass + high-pass filter
 *     stack (the "rain" body — ~600 Hz–4 kHz).
 *  2. A subtle LFO that gently breathes the gain so it sounds organic.
 *
 * The audio context is created lazily on first `start()` because browsers
 * block AudioContext creation until a user gesture.
 */
export type RainController = {
  playing: boolean;
  supported: boolean;
  volume: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
};

const MAX_VOLUME = 0.32;

export function useRainSound(initialVolume = 0.7): RainController {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);
  const [supported, setSupported] = useState(true);

  // Detect support once on mount (SSR-safe).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    setSupported(Boolean(AC));
  }, []);

  // Tear down audio when the component unmounts.
  useEffect(() => {
    return () => {
      try {
        sourceRef.current?.stop();
        lfoRef.current?.stop();
        ctxRef.current?.close();
      } catch { /* ignore — already closed */ }
    };
  }, []);

  // Lazily construct the graph the first time we need it.
  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;

    const ctx = new AC();
    ctxRef.current = ctx;

    // 4-second white-noise buffer, looped — long enough to avoid audible repetition.
    const bufLen = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, bufLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    sourceRef.current = src;

    // Filter stack — sounds like soft rain rather than full-band hiss.
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 380;
    hp.Q.value = 0.6;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 4200;
    lp.Q.value = 0.8;

    // Gentle peak around 1.2k to suggest droplets without harsh peaks.
    const peak = ctx.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.value = 1200;
    peak.Q.value = 1.4;
    peak.gain.value = 3;

    const master = ctx.createGain();
    master.gain.value = 0;
    masterRef.current = master;

    // LFO breathing — modulates ±0.04 around the chosen volume so the rain
    // feels alive rather than a static loop.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08; // ~12 s cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(master.gain);
    lfoRef.current = lfo;

    src.connect(hp).connect(lp).connect(peak).connect(master).connect(ctx.destination);

    src.start();
    lfo.start();

    return ctx;
  }, []);

  const fadeTo = useCallback((target: number, seconds: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + seconds);
  }, []);

  const start = useCallback(() => {
    const ctx = ensureGraph();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
    fadeTo(MAX_VOLUME * volume, 1.4);
    setPlaying(true);
  }, [ensureGraph, fadeTo, volume]);

  const stop = useCallback(() => {
    fadeTo(0, 0.7);
    setPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) stop(); else start();
  }, [playing, start, stop]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (playing) fadeTo(MAX_VOLUME * clamped, 0.4);
  }, [playing, fadeTo]);

  return { playing, supported, volume, start, stop, toggle, setVolume };
}
