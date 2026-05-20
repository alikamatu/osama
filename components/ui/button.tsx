"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
};

const variantCls: Record<Variant, string> = {
  primary:   "bg-accent text-accent-fg hover:brightness-110 active:brightness-95",
  secondary: "bg-surface-2 text-fg hover:bg-surface-3 active:bg-surface-3",
  ghost:     "bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
};
const sizeCls: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading,
    leadingIcon,
    trailingIcon,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      ref={ref}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium",
        "outline-none transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:[outline-color:var(--ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantCls[variant],
        sizeCls[size],
        className,
      )}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </motion.button>
  );
});
