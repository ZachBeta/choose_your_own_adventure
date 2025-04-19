import React from "react";
import { COLOR_PALETTE } from "../colorPalette";

export function TerminalButton({ children, variant = "primary", ...props }: {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "disabled";
  [key: string]: any;
}) {
  let background = COLOR_PALETTE.background;
  let color = COLOR_PALETTE.foreground;
  let border = `2px solid ${COLOR_PALETTE.highlight}`;
  let cursor = "pointer";
  if (variant === "accent") {
    border = `2px solid ${COLOR_PALETTE.accent}`;
    color = COLOR_PALETTE.accent;
  }
  if (variant === "disabled") {
    border = `2px solid ${COLOR_PALETTE.lowlight}`;
    color = COLOR_PALETTE.lowlight;
    cursor = "not-allowed";
  }
  return (
    <button
      style={{
        background,
        color,
        border,
        fontFamily: "monospace",
        padding: "8px 20px",
        borderRadius: 4,
        cursor,
        margin: 4,
        fontSize: 16,
        transition: "background 0.2s, color 0.2s",
        outline: "none"
      }}
      disabled={variant === "disabled"}
      {...props}
    >
      {children}
    </button>
  );
}
