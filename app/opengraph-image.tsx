import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Mateo & Julieth — Save the Date — 03.10.2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Fetches a Google Font subset and returns its binary contents so
 * ImageResponse can render with it. Satori (the engine behind @vercel/og)
 * cannot parse woff2 — only TTF/OTF. Google Fonts returns woff2 by default
 * for modern UAs, but when you pass `&text=<chars>` it returns a TTF subset
 * containing only those glyphs. We exploit that to guarantee a Satori-
 * compatible binary regardless of User-Agent.
 */
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

export default async function OpenGraphImage() {
  // Load the wedding photo as a data URI (uses the optimized 400KB version
  // already in /public, not the 36MB original).
  const photoBuffer = await readFile(join(process.cwd(), "public/photo.jpg"));
  const photoDataUri = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

  // Load the brand fonts. Falls back to serif/script if either fails.
  // We pass only the characters we actually render so Google Fonts returns a
  // TTF subset (Satori cannot parse woff2).
  let cormorant: ArrayBuffer | null = null;
  let italianno: ArrayBuffer | null = null;
  try {
    [cormorant, italianno] = await Promise.all([
      loadGoogleFont("Cormorant Garamond", 400, "SAVEDATE"),
      loadGoogleFont("Italianno", 400, "the"),
    ]);
  } catch {
    /* best-effort font loading; system serif will substitute */
  }

  type Font = {
    name: string;
    data: ArrayBuffer;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal" | "italic";
  };
  const fonts: Font[] = [];
  if (cormorant)
    fonts.push({ name: "Cormorant", data: cormorant, weight: 400, style: "normal" });
  if (italianno)
    fonts.push({ name: "Italianno", data: italianno, weight: 400, style: "normal" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1a1f1c",
        }}
      >
        {/* Photo background */}
        <img
          src={photoDataUri}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
          }}
        />

        {/* Dark gradient overlay for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,12,9,0.45) 0%, rgba(8,12,9,0.55) 50%, rgba(4,7,5,0.85) 100%)",
          }}
        />

        {/* Inner ivory frame — matches the passepartout on the live card */}
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "1px solid rgba(255,253,247,0.55)",
            borderRadius: 4,
          }}
        />

        {/* Content stack */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "#ffffff",
            textAlign: "center",
            padding: "60px 80px",
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.5em",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
              paddingLeft: "0.5em",
            }}
          >
            03.10.26
          </div>

          <div
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: 142,
              fontWeight: 300,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              lineHeight: 1,
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              paddingLeft: "0.14em",
            }}
          >
            <span>SAVE</span>
            <span
              style={{
                fontFamily: "Italianno, cursive",
                fontSize: 152,
                fontWeight: 400,
                textTransform: "lowercase",
                letterSpacing: "normal",
                margin: "0 24px",
                transform: "translateY(-6px)",
              }}
            >
              the
            </span>
            <span>DATE</span>
          </div>

          {/* Divider with diamond */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 28,
              width: 380,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.55)" }} />
            <div
              style={{
                width: 8,
                height: 8,
                background: "rgba(255,255,255,0.85)",
                transform: "rotate(45deg)",
              }}
            />
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.55)" }} />
          </div>

          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
              marginTop: 24,
              paddingLeft: "0.42em",
            }}
          >
            Mateo &amp; Julieth
          </div>

          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              marginTop: 14,
              paddingLeft: "0.34em",
            }}
          >
            Bogotá, Colombia
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
