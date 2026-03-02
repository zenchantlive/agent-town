# Agent Town — Pixel Art Specification (2026-02-21)

## 1) Technical Standards
- **Base Resolution:** 32x32 pixels per sprite.
- **Scaling:** Integer scaling only (1x, 2x, 4x). No fractional scaling to prevent blur.
- **Rendering:** `image-rendering: pixelated` (CSS) / `antialias: false` (Canvas).
- **Format:** Transparent PNG-8 or PNG-24.

## 2) Global Color Logic (Hue Shifting)
To achieve Stardew-esque depth, we avoid simple "darker" shades:
- **Highlights:** Shift towards Yellow/Orange (Warm).
- **Shadows:** Shift towards Blue/Purple (Cool).
- **Outline:** Very dark purple/midnight (#1a1a2e), never pure black.

## 3) Role Visual Identities

| Role | Primary Palette | Key Visual Element |
|------|-----------------|--------------------|
| **Architect** | Steel Blue / Silver | Blueprint roll or glowing mono-lens |
| **Builder** | Earthy Brown / Orange | Tool belt and rugged vest |
| **Critic** | Deep Royal Purple | Monocle and formal posture |
| **Verifier** | Bright Lime / Emerald | Glowing lantern or checkmark badge |
| **Scout** | Forest Green / Slate | Hooded cloak and light footwear |
| **Designer** | Neon Cyan / Magenta | Colorful scarf or paint-stained smock |
| **Mayor** | Gold / Crimson | Top hat and visible facilitator badge |

## 4) Animation Cycles
Following the `pixel-art-sprites` standard patterns:

### **Idle Cycle (4 Frames)**
- Frame 1-2: Standard pose.
- Frame 3: 1px "squash" (breathing).
- Frame 4: Return to standard.
- *Timing: 300ms per frame.*

### **Walk Cycle (6 Frames)**
- Standard "Contact -> Passing -> Contact -> Passing" pattern.
- 1px "bounce" on passing frames to give a weight-based feel.
- *Timing: 150ms per frame.*

## 5) Map/Tile Standards
- **Tile Size:** 32x32.
- **Tiling:** 47-tile "blob" bitmasking for seamless location transitions (Plaza -> Grass).
- **Lighting:** Fixed light source from Top-Left.
