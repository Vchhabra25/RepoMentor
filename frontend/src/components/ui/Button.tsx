import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-signal-gradient text-white shadow-glow hover:brightness-110 active:brightness-95",
  secondary: "bg-surface-elevated text-ink border border-border hover:bg-surface-hover",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-hover",
  outline: "border border-border text-ink hover:border-accent-indigo/50 hover:bg-surface-hover",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", icon, iconPosition = "left", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
