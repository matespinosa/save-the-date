import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen / iPadOS icon — same wax-seal motif as the browser favicon
 * but at 180×180 we have room to use the script font properly. iOS will mask
 * the square into its own rounded-corner shape, so we render a full-bleed
 * gold gradient with the M&J monogram centered.
 */
// See app/opengraph-image.tsx for why we pass `text` and limit the format to
// TTF/OTF — Satori cannot parse woff2, and Google Fonts only returns TTF
// subsets when the request includes `&text=`.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(opentype|truetype)'\)/,
  );
  if (!match) throw new Error(`Failed to parse font CSS for ${family}`);
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Failed to fetch font binary for ${family}`);
  return fontRes.arrayBuffer();
}

export default async function AppleIcon() {
  type Font = {
    name: string;
    data: ArrayBuffer;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal" | "italic";
  };
  const fonts: Font[] = [];
  try {
    const italianno = await loadGoogleFont("Italianno", 400, "M&J");
    fonts.push({ name: "Italianno", data: italianno, weight: 400, style: "normal" });
  } catch {
    /* best-effort — system serif will substitute */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 35% 30%, #fff2bf 0%, #d8b04e 55%, #9f7422 100%)",
          color: "#26392d",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.length > 0 ? "Italianno, serif" : "serif",
            fontSize: 130,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            transform: "translateY(-4px)",
            textShadow: "0 1px 0 rgba(255,247,205,0.5)",
          }}
        >
          M&amp;J
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
