import React from "react";
import { createRoot } from "react-dom/client";
import { COLOR_PALETTE } from "./colorPalette";
import { TerminalButton } from "./UI/Button";
import { TerminalPanel } from "./UI/Panel";
import { TerminalInput } from "./UI/Input";
import { TerminalCodeBlock } from "./UI/CodeBlock";

const fontStack = '"Fira Mono", "Consolas", "Monaco", monospace';

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div style={{ textAlign: "center", margin: 8 }}>
      <div
        style={{
          width: 60,
          height: 60,
          background: hex,
          border: `2px solid ${COLOR_PALETTE.foreground}`,
          borderRadius: 6,
          margin: "0 auto 8px auto",
        }}
      />
      <div style={{ color: COLOR_PALETTE.foreground, fontFamily: fontStack }}>{name}</div>
      <div style={{ color: COLOR_PALETTE.foreground, fontSize: 12, fontFamily: fontStack }}>{hex}</div>
    </div>
  );
}

function StyleGuide() {
  return (
    <div style={{ background: COLOR_PALETTE.background, color: COLOR_PALETTE.foreground, minHeight: "100vh", fontFamily: fontStack, padding: 32 }}>
      <h1 style={{ color: COLOR_PALETTE.accent }}>Retro Terminal Style Guide</h1>
      <h2 style={{ color: COLOR_PALETTE.highlight, marginTop: 32 }}>Color Palette</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {Object.entries(COLOR_PALETTE).map(([name, hex]) => (
          <ColorSwatch key={name} name={name} hex={hex} />
        ))}
      </div>

      <h2 style={{ color: COLOR_PALETTE.accent, marginTop: 40 }}>Typography</h2>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: COLOR_PALETTE.yellow }}>Heading Example</h3>
        <p style={{ color: COLOR_PALETTE.foreground }}>This is body text in the terminal font stack.</p>
        <p style={{ color: COLOR_PALETTE.blue, fontFamily: fontStack }}>Secondary text example (cyan).</p>
        <p style={{ color: COLOR_PALETTE.red, fontFamily: fontStack }}>Error text example (red).</p>
      </div>

      <h2 style={{ color: COLOR_PALETTE.accent, marginTop: 40 }}>Buttons</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <TerminalButton>Primary Button</TerminalButton>
        <TerminalButton variant="accent">Accent Button</TerminalButton>
        <TerminalButton variant="disabled">Disabled Button</TerminalButton>
      </div>

      <h2 style={{ color: COLOR_PALETTE.accent, marginTop: 40 }}>Inputs</h2>
      <div style={{ marginBottom: 24 }}>
        <TerminalInput placeholder="Type here..." />
      </div>

      <h2 style={{ color: COLOR_PALETTE.accent, marginTop: 40 }}>Panel</h2>
      <TerminalPanel>
        <div>This is a reusable terminal panel component.</div>
        <div style={{ color: COLOR_PALETTE.yellow }}>You can put anything inside it!</div>
      </TerminalPanel>

      <h2 style={{ color: COLOR_PALETTE.accent, marginTop: 40 }}>Code Block</h2>
      <TerminalCodeBlock>{`> npm run start
✔ Compiled successfully!
Welcome to the retro terminal UI.`}</TerminalCodeBlock>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<StyleGuide />);
