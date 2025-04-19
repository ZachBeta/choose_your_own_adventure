import React from "react";
import { COLOR_PALETTE } from "./colorPalette";

export default function ColorPaletteViewer() {
  return (
    <div style={{ background: COLOR_PALETTE.background, padding: 24, minHeight: "100vh" }}>
      <h2 style={{ color: COLOR_PALETTE.foreground }}>Game Color Palette</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {Object.entries(COLOR_PALETTE).map(([name, hex]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: hex,
                border: `2px solid ${COLOR_PALETTE.foreground}`,
                borderRadius: 12,
                marginBottom: 8,
              }}
            />
            <div style={{ color: COLOR_PALETTE.foreground }}>{name}</div>
            <div style={{ color: COLOR_PALETTE.foreground, fontSize: 12 }}>{hex}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
