import React from "react";
import { SUBCONSCIOUS_PALETTE } from "../subconsciousPalette";

export function SubconsciousInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        background: SUBCONSCIOUS_PALETTE.glass,
        color: SUBCONSCIOUS_PALETTE.dreamPurple,
        border: `2px solid ${SUBCONSCIOUS_PALETTE.abyssTeal}`,
        fontFamily: '"Inter", "Segoe UI", "Arial", sans-serif',
        fontSize: 17,
        padding: "10px 18px",
        borderRadius: 16,
        outline: "none",
        margin: 6,
        boxShadow: `0 2px 8px 0 ${SUBCONSCIOUS_PALETTE.glass}`,
        backdropFilter: "blur(6px)",
        ...props.style,
      }}
    />
  );
}
