import { Envelope } from "./components/Envelope";

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
        <Envelope />
      </section>
    </main>
  );
}

function BotanicalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-sage/45 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-champagne-soft/45 blur-3xl" />
      <BotanicalSprig className="absolute left-[-5.25rem] top-24 h-80 w-80 -rotate-12 text-forest/55 opacity-60" />
      <BotanicalSprig className="absolute right-[-4.5rem] top-32 h-72 w-72 scale-x-[-1] rotate-12 text-forest/45 opacity-55" />
      <BotanicalSprig className="absolute bottom-14 left-6 h-40 w-40 rotate-[28deg] text-moss/35 opacity-50" />
    </div>
  );
}

function BotanicalSprig({ className }: { className: string }) {
  const blossoms = [
    { x: 40, y: 52, s: 1.06, r: -14 },
    { x: 61, y: 78, s: 0.78, r: 16 },
    { x: 82, y: 52, s: 0.88, r: -8 },
    { x: 108, y: 72, s: 1, r: 12 },
    { x: 132, y: 44, s: 0.72, r: -18 },
    { x: 151, y: 84, s: 0.82, r: 10 },
  ];

  return (
    <svg className={className} viewBox="0 0 180 180" fill="none">
      <path
        d="M18 164 C42 126 55 88 75 56 C91 30 112 18 142 12"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path d="M48 105 C54 91 58 82 68 70" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M74 60 C70 46 68 38 74 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M96 42 C104 34 111 28 126 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M117 67 C128 62 139 60 156 66" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M38 122 C30 119 25 113 23 104 C34 104 40 111 38 122Z" fill="#8ea483" opacity="0.5" />
      <path d="M67 70 C57 68 51 62 49 52 C61 53 68 59 67 70Z" fill="#8ea483" opacity="0.5" />
      <path d="M104 34 C97 27 96 20 100 12 C109 19 111 27 104 34Z" fill="#8ea483" opacity="0.46" />
      {blossoms.map((flower) => (
        <g
          key={`${flower.x}-${flower.y}`}
          transform={`translate(${flower.x} ${flower.y}) rotate(${flower.r}) scale(${flower.s})`}
        >
          <path d="M-9 10 C-5 2 1 -3 7 -10" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <ellipse cx="-5.5" cy="-1.5" rx="5.6" ry="9" fill="#fffdf7" opacity="0.84" transform="rotate(-34 -5.5 -1.5)" />
          <ellipse cx="3.5" cy="-4" rx="5.2" ry="8.5" fill="#fffdf7" opacity="0.72" transform="rotate(24 3.5 -4)" />
          <ellipse cx="1" cy="4" rx="5.6" ry="8" fill="#fffdf7" opacity="0.7" transform="rotate(76 1 4)" />
          <circle cx="-1.5" cy="1.5" r="2.6" fill="#8ea483" opacity="0.88" />
          <circle cx="2.2" cy="-1.8" r="1.4" fill="#d8a48f" opacity="0.44" />
        </g>
      ))}
    </svg>
  );
}
