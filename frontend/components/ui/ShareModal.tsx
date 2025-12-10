"use client";

import { useState } from "react";
import Button3D from "./Button3D";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (method: "email" | "whatsapp" | "download") => void;
  title: string;
  description?: string;
}

export const ShareModal = ({
  isOpen,
  onClose,
  onShare,
  title,
  description,
}: ShareModalProps) => {
  if (!isOpen) return null;

  const shareOptions = [
    {
      method: "download" as const,
      icon: "📥",
      label: "Download PDF",
      description: "Save to your device",
      color: "indigo",
    },
    {
      method: "email" as const,
      icon: "📧",
      label: "Email",
      description: "Send via email",
      color: "blue",
    },
    {
      method: "whatsapp" as const,
      icon: "💬",
      label: "WhatsApp",
      description: "Share on WhatsApp",
      color: "green",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] border-3 border-indigo-500/30 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-wide">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Share Options */}
          <div className="space-y-3 mb-6">
            {shareOptions.map((option) => (
              <button
                key={option.method}
                onClick={() => {
                  onShare(option.method);
                  onClose();
                }}
                className="w-full group relative"
              >
                <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-3 border-gray-300 dark:border-gray-600 rounded-xl p-4 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{option.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-black text-gray-900 dark:text-white text-lg tracking-wide">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <Button3D variant="white" onClick={onClose} className="w-full">
            Cancel
          </Button3D>
        </div>
      </div>
    </div>
  );
};
