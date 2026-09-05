import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, hoverable = false, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl2 shadow-card",
        paddingStyles[padding],
        hoverable && "transition-all duration-300 hover:border-accent-indigo/40 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
