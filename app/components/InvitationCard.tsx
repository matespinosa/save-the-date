"use client";

import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function InvitationCard({ revealed }: { revealed: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[5px] bg-ink"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.35) inset, 0 0 0 1px rgba(38,57,45,0.16), 0 30px 60px -24px rgba(38,57,45,0.5)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/image-marriage-1.JPG)",
          backgroundPosition: "center 39%",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,22,18,0.04) 0%, rgba(16,20,16,0.1) 42%, rgba(7,10,8,0.68) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 0.65px, transparent 0.65px)",
          backgroundSize: "3px 3px",
        }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-8 text-center text-white sm:px-7 sm:pb-10"
        variants={containerVariants}
        initial="hidden"
        animate={revealed ? "visible" : "hidden"}
      >
        <motion.p
          variants={itemVariants}
          className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.5em] text-white/85 sm:text-[0.7rem]"
        >
          03.10.26
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="serif mt-2 text-[2rem] font-light uppercase leading-none tracking-[0.16em] text-white drop-shadow-sm sm:text-[2.7rem]"
        >
          Save
          <span className="script mx-1.5 inline-block -translate-y-0.5 text-[2.15rem] normal-case tracking-normal sm:text-[2.8rem]">
            the
          </span>
          Date
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-3 flex w-full max-w-[15rem] items-center gap-3"
        >
          <span className="h-px flex-1 bg-white/55" />
          <span className="h-1 w-1 rotate-45 bg-white/80" />
          <span className="h-px flex-1 bg-white/55" />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-3 font-sans text-[0.52rem] font-bold uppercase tracking-[0.42em] text-white/85 sm:text-[0.64rem]"
        >
          Mateo &amp; Julieth
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mt-2 font-sans text-[0.44rem] font-semibold uppercase tracking-[0.34em] text-white/70 sm:text-[0.54rem]"
        >
          Bogotá, Colombia
        </motion.p>
      </motion.div>
    </div>
  );
}
