import Image from "next/image";
import { Envelope } from "./components/Envelope";
import flowerOne from "../assets/flower 1.png";
import flowerTwo from "../assets/flower 2.png";

export default function Page() {
  return (
    <main className="relative flex min-h-svh w-full flex-col items-center overflow-hidden">
      <BotanicalBackdrop />

      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-7 sm:px-12">
        <span className="eyebrow text-moss/65">MMXXVI</span>
        <span className="script text-forest text-2xl leading-none">
          M &amp; J
        </span>
        <span className="eyebrow text-moss/65">03 · 10 · 2026</span>
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-8">
        <FlowerAssets />
        <div className="relative z-10">
          <Envelope />
        </div>
      </section>
    </main>
  );
}

function BotanicalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-sage/45 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-champagne-soft/45 blur-3xl" />
    </div>
  );
}

function FlowerAssets() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 mx-auto w-full max-w-5xl"
    >
      {/* Left branch — base tucked behind upper-left of envelope, tips reach up & out */}
      <Image
        src={flowerOne}
        alt=""
        priority
        className="absolute left-[calc(50%-18rem)] top-[calc(50%-19rem)] h-[clamp(20rem,42vw,30rem)] w-auto -rotate-[8deg] object-contain opacity-95 drop-shadow-[0_18px_22px_rgba(47,74,56,0.12)] max-sm:left-[calc(50%-12rem)] max-sm:top-[calc(50%-15rem)] max-sm:h-[19rem]"
      />
      {/* Right branch — base tucked behind upper-right of envelope, tips reach up & out */}
      <Image
        src={flowerTwo}
        alt=""
        priority
        className="absolute left-[calc(50%-1rem)] top-[calc(50%-18rem)] h-[clamp(17rem,36vw,26rem)] w-auto rotate-[10deg] object-contain opacity-95 drop-shadow-[0_16px_20px_rgba(47,74,56,0.1)] max-sm:left-[calc(50%-1rem)] max-sm:top-[calc(50%-14rem)] max-sm:h-[16rem]"
      />
    </div>
  );
}
