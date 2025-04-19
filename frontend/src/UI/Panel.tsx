import React from "react";
import { COLOR_PALETTE } from "../colorPalette";

export function TerminalPanel({ children, style = {}, ...props }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  return (
    <div
      style={{
        background: COLOR_PALETTE.lowlight,
        color: COLOR_PALETTE.foreground,
        border: `2px solid ${COLOR_PALETTE.highlight}`,
        borderRadius: 6,
        fontFamily: "monospace",
        padding: 20,
        margin: 12,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
