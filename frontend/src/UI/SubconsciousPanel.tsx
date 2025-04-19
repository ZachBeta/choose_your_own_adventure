import React from "react";
import { SUBCONSCIOUS_PALETTE } from "../subconsciousPalette";

export function SubconsciousPanel({ children, style = {}, ...props }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${SUBCONSCIOUS_PALETTE.deepBlue} 70%, ${SUBCONSCIOUS_PALETTE.dreamPurple} 100%)`,
        color: SUBCONSCIOUS_PALETTE.mistWhite,
        border: `2px solid ${SUBCONSCIOUS_PALETTE.abyssTeal}`,
        borderRadius: 18,
        fontFamily: '"Inter", "Segoe UI", "Arial", sans-serif',
        padding: 28,
        margin: 16,
        boxShadow: `0 8px 32px 0 ${SUBCONSCIOUS_PALETTE.glass}`,
        backdropFilter: "blur(8px)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
