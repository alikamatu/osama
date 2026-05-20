"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";

type Options = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Resolver = (v: boolean) => void;

const ConfirmContext = createContext<((o: Options) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ opts: Options; resolve: Resolver } | null>(null);

  const confirm = useCallback((opts: Options) => {
    return new Promise<boolean>((resolve) => {
      setState({ opts, resolve });
    });
  }, []);

  function close(v: boolean) {
    state?.resolve(v);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={Boolean(state)}
        onOpenChange={(v) => { if (!v) close(false); }}
        title={state?.opts.title}
        description={state?.opts.description}
        size="sm"
      >
        <div className="mt-1 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => close(false)}>
            {state?.opts.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            variant={state?.opts.destructive ? "secondary" : "primary"}
            onClick={() => close(true)}
            className={state?.opts.destructive ? "!text-[color:var(--danger)]" : undefined}
          >
            {state?.opts.confirmLabel ?? "Confirm"}
          </Button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
}
