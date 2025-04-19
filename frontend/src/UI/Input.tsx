import React from "react";
import { COLOR_PALETTE } from "../colorPalette";

export function TerminalInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        background: COLOR_PALETTE.background,
        color: COLOR_PALETTE.foreground,
        border: `2px solid ${COLOR_PALETTE.blue}`,
        fontFamily: "monospace",
        fontSize: 16,
        padding: "6px 12px",
        borderRadius: 3,
        outline: "none",
        margin: 4,
        ...props.style,
      }}
    />
  );
}
