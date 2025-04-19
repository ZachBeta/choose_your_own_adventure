import React from "react";
import { SUBCONSCIOUS_PALETTE } from "../subconsciousPalette";

export function SubconsciousButton({ children, variant = "primary", ...props }: {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost";
  [key: string]: any;
}) {
  let background = `linear-gradient(90deg, ${SUBCONSCIOUS_PALETTE.dreamPurple} 0%, ${SUBCONSCIOUS_PALETTE.abyssTeal} 100%)`;
  let color = SUBCONSCIOUS_PALETTE.mistWhite;
  let border = `2px solid ${SUBCONSCIOUS_PALETTE.highlightGold}`;
  let boxShadow = `0 2px 16px 0 ${SUBCONSCIOUS_PALETTE.glass}`;
  if (variant === "accent") {
    background = `linear-gradient(90deg, ${SUBCONSCIOUS_PALETTE.softPink} 0%, ${SUBCONSCIOUS_PALETTE.dreamPurple} 100%)`;
    border = `2px solid ${SUBCONSCIOUS_PALETTE.softPink}`;
  }
  if (variant === "ghost") {
    background = "transparent";
    color = SUBCONSCIOUS_PALETTE.dreamPurple;
    border = `2px solid ${SUBCONSCIOUS_PALETTE.dreamPurple}`;
    boxShadow = "none";
  }
  return (
    <button
      style={{
        background,
        color,
        border,
        fontFamily: '"Inter", "Segoe UI", "Arial", sans-serif',
        padding: "12px 28px",
        borderRadius: 22,
        cursor: "pointer",
        margin: 6,
        fontSize: 18,
        fontWeight: 500,
        boxShadow,
        transition: "all 0.2s",
        outline: "none",
        letterSpacing: 1,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
