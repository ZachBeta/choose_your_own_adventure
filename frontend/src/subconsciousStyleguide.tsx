import React from "react";
import { createRoot } from "react-dom/client";
import { SUBCONSCIOUS_PALETTE } from "./subconsciousPalette";
import { SubconsciousPanel } from "./UI/SubconsciousPanel";
import { SubconsciousButton } from "./UI/SubconsciousButton";
import { SubconsciousInput } from "./UI/SubconsciousInput";

const fontStack = '"Inter", "Segoe UI", "Arial", sans-serif';

// SVG starfield overlay
function StarfieldBG() {
  return (
    <svg style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="120" r="1.5" fill={SUBCONSCIOUS_PALETTE.starlightWhite} />
      <circle cx="400" cy="800" r="1.2" fill={SUBCONSCIOUS_PALETTE.moonlightSilver} />
      <circle cx="1200" cy="200" r="1.7" fill={SUBCONSCIOUS_PALETTE.goldStar} />
      <circle cx="900" cy="600" r="1.1" fill={SUBCONSCIOUS_PALETTE.starlightWhite} />
      <circle cx="700" cy="300" r="1.3" fill={SUBCONSCIOUS_PALETTE.moonlightSilver} />
      <circle cx="300" cy="500" r="1.4" fill={SUBCONSCIOUS_PALETTE.auroraTeal} />
      <circle cx="1000" cy="100" r="1.2" fill={SUBCONSCIOUS_PALETTE.nebulaPink} />
      <circle cx="1300" cy="700" r="1.1" fill={SUBCONSCIOUS_PALETTE.starlightWhite} />
      {/* Add more stars as desired */}
    </svg>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div style={{ textAlign: "center", margin: 8 }}>
      <div
        style={{
          width: 60,
          height: 60,
          background: hex,
          border: `2px solid ${SUBCONSCIOUS_PALETTE.cosmicPurple}`,
          borderRadius: 18,
          margin: "0 auto 8px auto",
          boxShadow: `0 2px 8px 0 ${SUBCONSCIOUS_PALETTE.glass}`,
        }}
      />
      <div style={{ color: SUBCONSCIOUS_PALETTE.cosmicPurple, fontFamily: fontStack }}>{name}</div>
      <div style={{ color: SUBCONSCIOUS_PALETTE.moonlightSilver, fontSize: 12, fontFamily: fontStack }}>{hex}</div>
    </div>
  );
}

function SubconsciousStyleGuide() {
  return (
    <div style={{ position: "relative", background: `linear-gradient(120deg, ${SUBCONSCIOUS_PALETTE.midnightBlack} 60%, ${SUBCONSCIOUS_PALETTE.deepSkyBlue} 100%)`, color: SUBCONSCIOUS_PALETTE.starlightWhite, minHeight: "100vh", fontFamily: fontStack, padding: 32, overflow: "hidden" }}>
      <StarfieldBG />
      <h1 style={{ color: SUBCONSCIOUS_PALETTE.cosmicPurple, letterSpacing: 2, position: "relative", zIndex: 1 }}>Subconscious Style Guide</h1>
      <h2 style={{ color: SUBCONSCIOUS_PALETTE.auroraTeal, marginTop: 32, position: "relative", zIndex: 1 }}>Color Palette</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, position: "relative", zIndex: 1 }}>
        {Object.entries(SUBCONSCIOUS_PALETTE).map(([name, hex]) => (
          <ColorSwatch key={name} name={name} hex={hex} />
        ))}
      </div>

      <h2 style={{ color: SUBCONSCIOUS_PALETTE.goldStar, marginTop: 40, position: "relative", zIndex: 1 }}>Typography</h2>
      <div style={{ marginBottom: 24, position: "relative", zIndex: 1 }}>
        <h3 style={{ color: SUBCONSCIOUS_PALETTE.nebulaPink, fontStyle: "italic" }}>Dream Heading</h3>
        <p style={{ color: SUBCONSCIOUS_PALETTE.starlightWhite }}>This is body text in a dreamy, modern font stack.</p>
        <p style={{ color: SUBCONSCIOUS_PALETTE.auroraTeal, fontFamily: fontStack }}>Secondary text example (aurora teal).</p>
        <p style={{ color: SUBCONSCIOUS_PALETTE.cosmicPurple, fontFamily: fontStack }}>Accent text example (cosmic purple).</p>
      </div>

      <h2 style={{ color: SUBCONSCIOUS_PALETTE.goldStar, marginTop: 40, position: "relative", zIndex: 1 }}>Buttons</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, position: "relative", zIndex: 1 }}>
        <SubconsciousButton>Primary Dream Button</SubconsciousButton>
        <SubconsciousButton variant="accent">Aurora Accent</SubconsciousButton>
        <SubconsciousButton variant="ghost">Ghost Button</SubconsciousButton>
      </div>

      <h2 style={{ color: SUBCONSCIOUS_PALETTE.goldStar, marginTop: 40, position: "relative", zIndex: 1 }}>Inputs</h2>
      <div style={{ marginBottom: 24, position: "relative", zIndex: 1 }}>
        <SubconsciousInput placeholder="Type your dream..." />
      </div>

      <h2 style={{ color: SUBCONSCIOUS_PALETTE.goldStar, marginTop: 40, position: "relative", zIndex: 1 }}>Panel</h2>
      <SubconsciousPanel>
        <div>This is a reusable subconscious panel component.</div>
        <div style={{ color: SUBCONSCIOUS_PALETTE.nebulaPink }}>Soft, dreamy, and layered with glassy effects.</div>
      </SubconsciousPanel>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<SubconsciousStyleGuide />);
