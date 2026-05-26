import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser tab favicon — a tiny wax-seal monogram. At 32×32 we can't read
 * the script font reliably, so the initials are set in a small bold serif on
 * the same gold-gradient background as the envelope's wax seal.
 */
export default function Icon() {
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
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-0.04em",
          borderRadius: "50%",
        }}
      >
        M&amp;J
      </div>
    ),
    size,
  );
}
