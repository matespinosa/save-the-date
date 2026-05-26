"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import { InvitationCard } from "./InvitationCard";

type Stage = "sealed" | "opening" | "revealed";

const SEAL_DURATION = 0.65;
const FLAP_DELAY = 0.35;
const FLAP_DURATION = 1.05;
const CARD_DELAY = FLAP_DELAY + 0.55;
const CARD_DURATION = 1.5;

const sealVariants: Variants = {
  sealed: { scale: 1, opacity: 1, rotate: 0 },
  opening: {
    scale: [1, 1.12, 0],
    rotate: [0, -6, 28],
    opacity: [1, 1, 0],
    transition: { duration: SEAL_DURATION, ease: "easeIn", times: [0, 0.4, 1] },
  },
  revealed: { scale: 0, opacity: 0, rotate: 28 },
};

const flapVariants: Variants = {
  sealed: { rotateX: 0, opacity: 1, zIndex: 30 },
  opening: {
    rotateX: -180,
    opacity: 0,
    zIndex: 0,
    transition: {
      rotateX: {
        duration: FLAP_DURATION,
        ease: [0.65, 0, 0.35, 1],
        delay: FLAP_DELAY,
      },
      // Fade out right as the flap reaches edge-on, so it visually
      // tucks behind the envelope instead of flipping above it.
      opacity: {
        duration: 0.25,
        delay: FLAP_DELAY + FLAP_DURATION * 0.46,
        ease: "easeIn",
      },
      zIndex: { duration: 0, delay: FLAP_DELAY + FLAP_DURATION * 0.5 },
    },
  },
  revealed: { rotateX: -180, opacity: 0, zIndex: 0 },
};

const cardSlideVariants: Variants = {
  sealed: { y: 0 },
  opening: {
    y: "-78%",
    transition: {
      duration: CARD_DURATION,
      ease: [0.16, 1, 0.3, 1],
      delay: CARD_DELAY,
    },
  },
  revealed: { y: "-78%" },
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
  opening: { opacity: 0, y: 8, transition: { duration: 0.25 } },
  revealed: { opacity: 0, y: 8 },
};

export function Envelope() {
  const [stage, setStage] = useState<Stage>("sealed");
  const reduced = useReducedMotion();

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
          style={{ perspective: "1400px" }}
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

            {/* Card pocket — z-10, clipped so card can escape ONLY upward */}
            <div
              className={`absolute inset-0 ${stage === "sealed" ? "z-10" : "z-40"}`}
              style={{
                clipPath: "inset(-1200px 0 0 0)",
              }}
            >
              <motion.div
                className="absolute left-1/2"
                style={{
                  width: "76%",
                  aspectRatio: "5 / 6",
                  x: "-50%",
                  top: "5%",
                  transformOrigin: "50% 100%",
                  filter:
                    stage === "sealed"
                      ? "drop-shadow(0 0 0 rgba(0,0,0,0))"
                      : "drop-shadow(0 28px 30px rgba(47,74,56,0.28))",
                }}
                variants={cardSlideVariants}
                initial="sealed"
                animate={stage}
              >
                <InvitationCard revealed={stage === "revealed"} />
              </motion.div>
            </div>

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
              }}
              variants={flapVariants}
              initial="sealed"
              animate={stage}
            >
              {/* Outside face */}
              <div
                className="lemon-granite absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, #c8ceb0 0%, #9aa37a 68%, #727b58 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
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

              {/* Inside face (revealed when flap rotates) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, #79835d 0%, #b7bea0 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                  boxShadow: "inset 0 -1px 4px rgba(48,55,35,0.2)",
                }}
              />

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
          "radial-gradient(circle at 35% 30%, #f0dcc6 0%, #d5a892 45%, #9d6f61 100%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,245,230,0.55), inset 0 -3px 6px rgba(70,45,38,0.28), 0 4px 14px rgba(92,60,48,0.22)",
      }}
    >
      {/* Ring */}
      <span
        aria-hidden
        className="absolute inset-1.5 rounded-full"
        style={{
          border: "0.5px solid rgba(255,245,230,0.48)",
          boxShadow: "inset 0 0 6px rgba(70,45,38,0.16)",
        }}
      />
      {/* Monogram */}
      <span
        className="script select-none text-2xl leading-none text-paper drop-shadow-[0_1px_0_rgba(70,45,38,0.24)]"
        style={{ marginTop: "-2px" }}
      >
        M&amp;J
      </span>
    </div>
  );
}
