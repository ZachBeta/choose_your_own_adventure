import React from "react";
import { COLOR_PALETTE } from "../colorPalette";

export function TerminalCodeBlock({ children, style = {}, ...props }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  return (
    <pre
      style={{
        background: COLOR_PALETTE.background,
        color: COLOR_PALETTE.green || COLOR_PALETTE.foreground,
        border: `2px solid ${COLOR_PALETTE.lowlight}`,
        fontFamily: "monospace",
        fontSize: 15,
        padding: 16,
        borderRadius: 4,
        margin: 8,
        overflowX: "auto",
        ...style,
      }}
      {...props}
    >
      {children}
    </pre>
  );
}
