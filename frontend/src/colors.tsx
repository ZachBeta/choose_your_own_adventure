import React from "react";
import { createRoot } from "react-dom/client";
import ColorPaletteViewer from "./ColorPaletteViewer";

const root = createRoot(document.getElementById("root")!);
root.render(<ColorPaletteViewer />);
