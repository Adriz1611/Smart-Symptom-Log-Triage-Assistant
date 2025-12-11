"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";

export type ButtonVariant =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "yellow"
  | "teal"
  | "pink"
  | "indigo"
  | "white"
  | "emerald"
  | "cyan";

export type ButtonSize = "sm" | "md" | "lg";

interface Button3DProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantStyles: Record<
  ButtonVariant,
  { top: string; bottom: string; text: string }
> = {
  blue: {
    top: "#0066ff",
    bottom: "#0052cc",
    text: "#ffffff",
  },
  green: {
    top: "#39ff14",
    bottom: "#2ecc11",
    text: "#000000",
  },
  purple: {
    top: "#c724b1",
    bottom: "#9e1d8e",
    text: "#ffffff",
  },
  orange: {
    top: "#ff6b35",
    bottom: "#cc562a",
    text: "#ffffff",
  },
  red: {
    top: "#ff0000",
    bottom: "#cc0000",
    text: "#ffffff",
  },
  yellow: {
    top: "#ffed4e",
    bottom: "#ccbe3e",
    text: "#000000",
  },
  teal: {
    top: "#20d9d2",
    bottom: "#1aaea8",
    text: "#000000",
  },
  pink: {
    top: "#ff6b9d",
    bottom: "#cc567e",
    text: "#ffffff",
  },
  indigo: {
    top: "#6366f1",
    bottom: "#4f52c1",
    text: "#ffffff",
  },
  cyan: {
    top: "#00ffff",
    bottom: "#00cccc",
    text: "#000000",
  },
  white: {
    top: "#ffffff",
    bottom: "#e5e5e5",
    text: "#000000",
  },
  emerald: {
    top: "#10b981",
    bottom: "#0d9467",
    text: "#ffffff",
  },
};

export default function Button3D({
  variant = "blue",
  size = "md",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  fullWidth = false,
}: Button3DProps) {
  const { theme } = useTheme();
  const styles = variantStyles[variant];
  const borderColor = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-3d ${fullWidth ? "w-full" : ""} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <span
        className={`btn-3d-top ${sizeClasses[size]} uppercase tracking-wide font-black`}
        style={{
          background: styles.top,
          color: styles.text,
          border: `4px solid ${borderColor}`,
        }}
      >
        {children}
      </span>
      <span
        className="btn-3d-bottom"
        style={{
          background: styles.bottom,
          border: `4px solid ${borderColor}`,
        }}
      />
    </button>
  );
}
