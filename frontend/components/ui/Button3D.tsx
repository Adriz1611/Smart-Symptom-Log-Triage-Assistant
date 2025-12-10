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
  | "emerald";

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
  { top: string; bottom: string; text: string; glow?: string }
> = {
  blue: {
    top: "rgb(147, 197, 253)",
    bottom: "rgb(96, 165, 250)",
    text: "rgb(30, 58, 138)",
    glow: "rgba(96, 165, 250, 0.6)",
  },
  green: {
    top: "rgb(134, 239, 172)",
    bottom: "rgb(74, 222, 128)",
    text: "rgb(22, 101, 52)",
    glow: "rgba(74, 222, 128, 0.6)",
  },
  purple: {
    top: "rgb(216, 180, 254)",
    bottom: "rgb(192, 132, 252)",
    text: "rgb(88, 28, 135)",
    glow: "rgba(192, 132, 252, 0.6)",
  },
  orange: {
    top: "rgb(253, 186, 116)",
    bottom: "rgb(251, 146, 60)",
    text: "rgb(124, 45, 18)",
    glow: "rgba(251, 146, 60, 0.6)",
  },
  red: {
    top: "rgb(252, 165, 165)",
    bottom: "rgb(248, 113, 113)",
    text: "rgb(127, 29, 29)",
    glow: "rgba(248, 113, 113, 0.6)",
  },
  yellow: {
    top: "rgb(254, 240, 138)",
    bottom: "rgb(250, 204, 21)",
    text: "rgb(113, 63, 18)",
    glow: "rgba(250, 204, 21, 0.6)",
  },
  teal: {
    top: "rgb(153, 246, 228)",
    bottom: "rgb(94, 234, 212)",
    text: "rgb(19, 78, 74)",
    glow: "rgba(94, 234, 212, 0.6)",
  },
  pink: {
    top: "rgb(249, 168, 212)",
    bottom: "rgb(244, 114, 182)",
    text: "rgb(131, 24, 67)",
    glow: "rgba(244, 114, 182, 0.6)",
  },
  indigo: {
    top: "rgb(196, 181, 253)",
    bottom: "rgb(165, 180, 252)",
    text: "rgb(67, 56, 202)",
    glow: "rgba(165, 180, 252, 0.6)",
  },
  white: {
    top: "rgb(255, 255, 238)",
    bottom: "rgb(229, 229, 199)",
    text: "rgb(36, 38, 34)",
    glow: "rgba(229, 229, 229, 0.6)",
  },
  emerald: {
    top: "rgb(167, 243, 208)",
    bottom: "rgb(110, 231, 183)",
    text: "rgb(6, 78, 59)",
    glow: "rgba(110, 231, 183, 0.6)",
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
  const colors = variantStyles[variant];
  const [isActive, setIsActive] = React.useState(false);
  const { theme } = useTheme();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        position: "relative",
        display: fullWidth ? "block" : "inline-block",
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: "10px",
        paddingLeft: 0,
        margin: 0,
        backgroundColor: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Shadow layer - bottom most */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% + 2px)",
            height: "100%",
            background:
              theme === "dark" ? "rgb(60, 60, 60)" : "rgb(140, 140, 140)",
            top: "10px",
            left: "-1px",
            borderRadius: "12px",
            outline: "2px solid rgb(36, 38, 34)",
          }}
        />
        {/* Bottom layer - middle */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: theme === "dark" ? "rgb(40, 40, 40)" : colors.bottom,
            top: "6px",
            left: 0,
            borderRadius: "12px",
            outline: "2px solid rgb(36, 38, 34)",
          }}
        />
        {/* Top layer - topmost */}
        <div
          className={`${sizeClasses[size]} flex items-center justify-center font-medium`}
          style={{
            position: "relative",
            width: "100%",
            background: theme === "dark" ? "rgb(26, 29, 41)" : colors.top,
            color: theme === "dark" ? "#e5e7eb" : colors.text,
            borderRadius: "12px",
            outline:
              theme === "dark" && colors.glow
                ? `2px solid ${colors.glow}`
                : "2px solid rgb(36, 38, 34)",
            boxShadow:
              theme === "dark" && colors.glow
                ? `0 0 8px ${colors.glow}, 0 0 16px ${colors.glow}, 0 0 24px ${colors.glow}`
                : "none",
            transition: "transform 0.2s",
            transform:
              isActive && !disabled ? "translateY(6px)" : "translateY(0)",
            overflow: "hidden",
          }}
        >
          {/* Shine effect */}
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "24px",
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)"
                  : "rgba(0, 0, 0, 0.1)",
              transform: "skewX(30deg)",
              left: isActive && !disabled ? "calc(100% + 20px)" : "-20px",
              transition: "left 0.3s",
              pointerEvents: "none",
            }}
          />
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        </div>
      </div>
    </button>
  );
}
