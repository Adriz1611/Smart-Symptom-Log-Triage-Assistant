"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";

interface Select3DProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export default function Select3D({
  value,
  onChange,
  options,
  className = "",
}: Select3DProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative rounded-xl transition-all duration-200"
        style={{
          background: theme === "dark" ? "#1a1d29" : "#ffffff",
          border: theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
          boxShadow: isFocused
            ? theme === "dark"
              ? "0 6px 0 #2d3748, 0 0 0 3px rgba(147, 197, 253, 0.4)"
              : "0 6px 0 #242622, 0 0 0 3px rgba(147, 197, 253, 0.4)"
            : isHovered
            ? theme === "dark"
              ? "0 5px 0 #2d3748"
              : "0 5px 0 #242622"
            : theme === "dark"
            ? "0 4px 0 #2d3748"
            : "0 4px 0 #242622",
          transform: isFocused
            ? "translateY(2px)"
            : isHovered
            ? "translateY(1px)"
            : "translateY(0)",
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative w-full px-4 py-3 border-none outline-none font-bold cursor-pointer z-10 appearance-none pr-10 rounded-xl text-sm sm:text-base"
          style={{
            background: theme === "dark" ? "#1a1d29" : "#ffffff",
            color: theme === "dark" ? "#e5e7eb" : "#242622",
            backgroundImage:
              theme === "dark"
                ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e5e7eb' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23242622' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.25em 1.25em",
          }}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                background: theme === "dark" ? "#1a1d29" : "#ffffff",
                color: theme === "dark" ? "#e5e7eb" : "#242622",
                fontWeight: "600",
                padding: "8px",
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
