"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { InvitationCard } from "./InvitationCard";

type Stage = "sealed" | "opening" | "revealed";

// Continuous timing — every beat overlaps the next so there is never a moment
// where nothing is moving. Total visible motion is ~1.55s from click to card
// settled, vs. ~2.4s before.
const SEAL_DURATION = 0.38;
const FLAP_DELAY = 0.06;
const FLAP_DURATION = 0.68;
const FLAP_MID = FLAP_DELAY + FLAP_DURATION * 0.5; // ~0.4s — flap is edge-on
const CARD_DELAY = FLAP_DELAY + FLAP_DURATION * 0.62; // ~0.48s — card emerges as flap tucks back
const CARD_DURATION = 1.05;

// Seal cracks loose: scales up briefly (anticipation), then breaks free and
// tumbles up & away while fading.
const sealVariants: Variants = {
  sealed: { scale: 1, opacity: 1, rotate: 0, y: 0 },
  opening: {
    scale: [1, 1.2, 0.55, 0],
    rotate: [0, -9, 22, 42],
    opacity: [1, 1, 0.65, 0],
    y: [0, -3, -16, -32],
    transition: {
      duration: SEAL_DURATION,
      ease: [0.32, 0.1, 0.65, 1],
      times: [0, 0.28, 0.7, 1],
    },
  },
  revealed: { scale: 0, opacity: 0, rotate: 42, y: -32 },
};

// Flap lifts off the body, then folds backward over the top fold and STAYS
// there — visible above the envelope with its inside face showing, like a real
// opened invitation envelope.
const flapVariants: Variants = {
  sealed: { rotateX: 0, y: 0, zIndex: 30 },
  opening: {
    rotateX: -172,
    y: [0, -5, -2, 0],
    zIndex: 0,
    transition: {
      rotateX: {
        duration: FLAP_DURATION,
        ease: [0.5, 0.02, 0.22, 1],
        delay: FLAP_DELAY,
      },
      y: {
        duration: FLAP_DURATION * 0.85,
        times: [0, 0.25, 0.6, 1],
        ease: "easeOut",
        delay: FLAP_DELAY,
      },
      // Drop behind the card pocket right as the flap goes edge-on,
      // so the card slides in front when it starts to emerge.
      zIndex: { duration: 0, delay: FLAP_MID },
    },
  },
  revealed: { rotateX: -172, y: 0, zIndex: 0 },
};

// Card starts fully hidden (opacity 0) and materializes as it rises — the
// fade-in is synced with the slide so the card visually "appears" as it
// emerges from the envelope, rather than popping into view at full opacity.
const cardSlideVariants: Variants = {
  sealed: { y: 0, opacity: 0, rotate: 0 },
  opening: {
    y: "-78%",
    opacity: 1,
    rotate: [0, 1.2, -0.6, 0.2, 0],
    transition: {
      y: {
        duration: CARD_DURATION,
        ease: [0.16, 1, 0.3, 1],
        delay: CARD_DELAY,
      },
      opacity: {
        duration: CARD_DURATION * 0.7,
        ease: [0.4, 0, 0.4, 1],
        delay: CARD_DELAY + CARD_DURATION * 0.05,
      },
      rotate: {
        duration: CARD_DURATION,
        times: [0, 0.18, 0.5, 0.78, 1],
        ease: "easeInOut",
        delay: CARD_DELAY,
      },
    },
  },
  revealed: { y: "-78%", opacity: 1, rotate: 0 },
};

const stageShiftVariants: Variants = {
  sealed: { y: 0 },
  opening: {
    y: 142,
    transition: {
      duration: CARD_DURATION,
      ease: [0.16, 1, 0.3, 1],
      delay: CARD_DELAY,
    },
  },
  revealed: { y: 142 },
};

const ctaVariants: Variants = {
  sealed: { opacity: 1, y: 0 },
  opening: { opacity: 0, y: 8, transition: { duration: 0.2 } },
  revealed: { opacity: 0, y: 8 },
};

// Pocket z-index flips from behind-the-flap (z-10) to in-front-of-everything
// (z-40) precisely as the card begins its slide — so the card never overlaps a
// still-rotating flap, and never pops into view before moving.
const pocketVariants: Variants = {
  sealed: { zIndex: 10 },
  opening: {
    zIndex: 40,
    transition: { zIndex: { duration: 0, delay: CARD_DELAY - 0.02 } },
  },
  revealed: { zIndex: 40 },
};


export function Envelope() {
  const [stage, setStage] = useState<Stage>("sealed");
  // Tracks which face of the flap should be in the DOM. Only ONE face is ever
  // rendered, swapped at the rotation midpoint when the flap is edge-on. This
  // sidesteps Safari's unreliable backface-visibility handling inside
  // preserve-3d ancestors — the wrong face simply cannot render because it
  // does not exist in the tree.
  const [flapFlipped, setFlapFlipped] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (stage === "opening") {
      if (reduced) {
        setFlapFlipped(true);
        return;
      }
      const t = window.setTimeout(
        () => setFlapFlipped(true),
        FLAP_MID * 1000,
      );
      return () => window.clearTimeout(t);
    }
    if (stage === "sealed") {
      setFlapFlipped(false);
    }
  }, [stage, reduced]);

  const handleOpen = () => {
    if (stage !== "sealed") return;
    setStage("opening");
    const total = (CARD_DELAY + CARD_DURATION) * 1000 + 200;
    window.setTimeout(() => setStage("revealed"), reduced ? 0 : total);
  };

  const handleReset = () => setStage("sealed");

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      variants={stageShiftVariants}
      initial="sealed"
      animate={stage}
    >
      {/* Stage container — gives room for card to extract upward */}
      <div
        className="envelope-frame relative"
        style={{
          width: "min(86vw, 460px)",
          aspectRatio: "460 / 310",
        }}
      >
        {/* Floor shadow — softens when card extracted */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-forest/25 blur-2xl"
          style={{ bottom: "-7%", height: "10%", width: "90%" }}
          animate={{
            opacity: stage === "sealed" ? 0.9 : 0.55,
            scaleX: stage === "sealed" ? 1 : 0.85,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Idle floating envelope wrapper */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={stage !== "sealed"}
          aria-label="Abrir la invitación"
          className={`relative h-full w-full ${
            stage === "sealed" ? "cursor-pointer" : "cursor-default"
          }`}
          style={{ perspective: "1150px" }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={{
              y: stage === "sealed" ? [0, -6, 0] : 0,
            }}
            transition={{
              duration: 4.5,
              repeat: stage === "sealed" ? Infinity : 0,
              ease: "easeInOut",
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Back panel (envelope interior) */}
            <div
              className="lemon-granite absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(180deg, #9fa883 0%, #c2c8a3 50%, #78815f 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 8px rgba(48,55,35,0.2), 0 18px 40px -18px rgba(48,55,35,0.5)",
              }}
            >
              {/* Subtle inner V lines suggesting envelope side folds */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 480 320"
                preserveAspectRatio="none"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="0"
                  x2="240"
                  y2="180"
                  stroke="rgba(49,58,36,0.2)"
                  strokeWidth="0.6"
                />
                <line
                  x1="480"
                  y1="0"
                  x2="240"
                  y2="180"
                  stroke="rgba(49,58,36,0.2)"
                  strokeWidth="0.6"
                />
                <line
                  x1="0"
                  y1="320"
                  x2="240"
                  y2="180"
                  stroke="rgba(49,58,36,0.14)"
                  strokeWidth="0.6"
                />
                <line
                  x1="480"
                  y1="320"
                  x2="240"
                  y2="180"
                  stroke="rgba(49,58,36,0.14)"
                  strokeWidth="0.6"
                />
              </svg>
            </div>

            {/* Card pocket — z-index flips on a delay so the card doesn't pop
                in front of the flap before its slide begins */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: "inset(-1200px 0 0 0)",
              }}
              variants={pocketVariants}
              initial="sealed"
              animate={stage}
            >
              <motion.div
                className="absolute left-1/2"
                style={{
                  width: "76%",
                  aspectRatio: "5 / 6",
                  x: "-50%",
                  top: "5%",
                  transformOrigin: "50% 100%",
                  willChange: "transform",
                }}
                variants={cardSlideVariants}
                initial="sealed"
                animate={stage}
              >
                <InvitationCard revealed={stage === "revealed"} />
              </motion.div>
            </motion.div>

            {/* Front body — z-20, V notch goes from top corners to a point at 62.5% */}
            <div
              className="lemon-granite absolute inset-0 z-20 rounded-2xl"
              style={{
                background:
                  "linear-gradient(170deg, #b7bd98 0%, #969f78 48%, #707858 100%)",
                clipPath:
                  "polygon(0 0, 50% 62.5%, 100% 0, 100% 100%, 0 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.48), 0 22px 40px -22px rgba(48,55,35,0.45)",
              }}
            >
              {/* Hairline gold seam tracing the V edges of the body */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 480 320"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0 0 L240 200 L480 0"
                  fill="none"
                  stroke="rgba(49,58,36,0.26)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            {/* Top flap — z-30, rotates open */}
            <motion.div
              className="absolute inset-x-0 top-0 z-30"
              style={{
                height: "62.5%",
                transformOrigin: "top",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              variants={flapVariants}
              initial="sealed"
              animate={stage}
            >
              {/* Only one face is in the DOM at a time. The swap happens
                  exactly when the flap is edge-on (FLAP_MID), so the change
                  is invisible to the user but bulletproof across browsers. */}
              {!flapFlipped ? (
                /* Outside face — sealed envelope appearance */
                <div
                  className="lemon-granite absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #c8ceb0 0%, #9aa37a 68%, #727b58 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 16px -8px rgba(48,55,35,0.36)",
                  }}
                >
                  {/* Hairline gold edge along the V seam */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 480 200"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M0 0 L240 200 L480 0"
                      fill="none"
                      stroke="rgba(49,58,36,0.26)"
                      strokeWidth="0.8"
                    />
                  </svg>
                </div>
              ) : (
                /* Inside face — no self-rotation. The parent flap's -172°
                   fold around its top edge is enough: the local bottom edge
                   (V tip) ends up above the envelope as the folded apex, and
                   the local top edge stays anchored at the envelope's top
                   fold. Gradient is darker at local top (the fold/shadow)
                   and lighter at local bottom (the well-lit apex). */
                <div
                  className="lemon-granite absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #a8b291 0%, #cdd2b3 45%, #dfe2c8 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow:
                      "inset 0 -2px 6px rgba(48,55,35,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
                  }}
                >
                  {/* Subtle V-seam hairline along the inside fold */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 480 200"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M0 0 L240 200 L480 0"
                      fill="none"
                      stroke="rgba(49,58,36,0.18)"
                      strokeWidth="0.6"
                    />
                  </svg>
                </div>
              )}

              {/* Wax seal at the V point */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: "92%", zIndex: 2 }}
                variants={sealVariants}
                initial="sealed"
                animate={stage}
              >
                <WaxSeal idle={stage === "sealed"} />
              </motion.div>
            </motion.div>
          </motion.div>
        </button>

        {/* CTA below envelope */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ bottom: "-3rem" }}
          variants={ctaVariants}
          initial="sealed"
          animate={stage}
        >
          <span className="eyebrow text-forest/55">Toca para abrir</span>
          <span className="text-champagne-deep text-xs">↑</span>
        </motion.div>
      </div>

      {/* Reset link — appears after reveal, shifts with the stage */}
      <motion.button
        type="button"
        onClick={handleReset}
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: stage === "revealed" ? 0.7 : 0,
          y: stage === "revealed" ? 0 : 6,
        }}
        transition={{ duration: 0.6, delay: stage === "revealed" ? 0.8 : 0 }}
        className="eyebrow text-forest/65 transition-colors hover:text-champagne-deep"
        style={{ pointerEvents: stage === "revealed" ? "auto" : "none" }}
      >
        Volver a sellar
      </motion.button>
    </motion.div>
  );
}

function WaxSeal({ idle }: { idle: boolean }) {
  return (
    <div
      className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
        idle ? "seal-pulse" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #fff2bf 0%, #d8b04e 42%, #9f7422 100%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,248,210,0.72), inset 0 -3px 7px rgba(72,48,10,0.34), 0 4px 16px rgba(115,82,21,0.28)",
      }}
    >
      {/* Ring */}
      <span
        aria-hidden
        className="absolute inset-1.5 rounded-full"
        style={{
          border: "0.5px solid rgba(255,247,205,0.72)",
          boxShadow:
            "inset 0 0 6px rgba(72,48,10,0.2), 0 0 0 1px rgba(85,58,16,0.14)",
        }}
      />
      {/* Monogram */}
      <span
        className="script select-none text-[1.15rem] leading-none text-forest drop-shadow-[0_1px_0_rgba(255,246,203,0.48)] sm:text-[1.25rem]"
        style={{ transform: "translateY(-1px)", letterSpacing: "-0.04em" }}
      >
        M&amp;J
      </span>
    </div>
  );
}
