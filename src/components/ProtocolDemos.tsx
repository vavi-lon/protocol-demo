import { useState } from 'react';
import { FadeIn } from './shared';
// @ts-ignore
import ButterflyObject from '../v4_object.jsx';
// @ts-ignore
import ButterflyBanking from '../v5_banking.jsx';
// @ts-ignore
import ButterflyTicket from '../v6_ticket.jsx';

type Key = 'object' | 'banking' | 'ticket';

const tabs: {
  key: Key;
  label: string;
  sublabel: string;
  metaphor: string;
  desc: string;
}[] = [
  {
    key: 'object',
    label: 'The Object',
    sublabel: 'Product gallery',
    metaphor: 'A single card, lit from above. Same object, different content per step.',
    desc: 'Apple-product feel. The card breathes. Content morphs through the protocol. For the marketing eye.',
  },
  {
    key: 'banking',
    label: 'Banking',
    sublabel: 'Enterprise product',
    metaphor: 'HR dashboard. 100% team readiness. Pill progress bars. Dark hero card.',
    desc: 'Fintech confidence on a mental-health tool. For HR directors who buy software.',
  },
  {
    key: 'ticket',
    label: 'The Ticket',
    sublabel: 'Civic document',
    metaphor: 'Paper-style civic ticket. Tears at every step. Red "VALIDATED" stamp at the end.',
    desc: 'Feels like CPR certification. For Constitution, governance, foundation context.',
  },
];

export default function ProtocolDemos() {
  const [active, setActive] = useState<Key>('object');
  const activeTab = tabs.find((t) => t.key === active)!;

  return (
    <section className="section bg-bg-muted/30 relative overflow-hidden">
      {/* Soft ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(10,74,214,0.08), transparent 70%)',
        }}
      />

      <div className="container relative">
        {/* Section heading */}
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-12">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hair shadow-sm text-ink/80 font-semibold text-[12px] tracking-[0.08em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Interactive gallery · Three treatments
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 mx-auto">
              Three ways to run the <span className="text-accent">same protocol.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[16px] md:text-[17px] text-muted mx-auto max-w-[620px]">
              Same 30 seconds. Same 4 steps. Three design treatments for three different audiences. Pick one below, then tap through it.
            </p>
          </FadeIn>
        </div>

        {/* Tabs */}
        <FadeIn delay={0.15}>
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex p-1.5 rounded-full bg-white border border-hair shadow-sm gap-1"
              role="tablist"
            >
              {tabs.map((t) => {
                const isActive = t.key === active;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(t.key)}
                    className="rounded-full px-4 md:px-5 py-2 md:py-2.5 text-[13px] md:text-[14px] font-semibold transition-all flex items-center gap-2"
                    style={{
                      background: isActive ? 'var(--color-ink)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--color-ink)',
                      letterSpacing: '-0.005em',
                    }}
                  >
                    <span
                      className="text-[10px] font-bold rounded-full px-1.5 py-[1px]"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.18)' : 'var(--color-bg-muted)',
                        color: isActive ? '#ffffff' : 'var(--color-caption)',
                      }}
                    >
                      {t.key === 'object' ? 'V4' : t.key === 'banking' ? 'V5' : 'V6'}
                    </span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Active tab caption */}
        <FadeIn delay={0.2}>
          <div className="text-center max-w-[600px] mx-auto mb-10">
            <p className="text-[13px] text-accent font-bold uppercase tracking-[0.2em] mb-2">
              {activeTab.sublabel}
            </p>
            <p className="text-[17px] md:text-[19px] text-ink font-medium mb-3 leading-snug">
              {activeTab.metaphor}
            </p>
            <p className="text-[14px] text-muted max-w-[520px] mx-auto">
              {activeTab.desc}
            </p>
          </div>
        </FadeIn>

        {/* Phone frame containing active variant */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="relative rounded-[52px] p-[10px]"
              style={{
                width: 400,
                background: 'linear-gradient(180deg, #1a1a1c, #0a0a0c)',
                boxShadow:
                  '0 30px 80px -20px rgba(11,11,15,0.35), 0 4px 0 rgba(255,255,255,0.04) inset',
              }}
            >
              <div
                className="relative rounded-[44px] overflow-hidden"
                style={{ background: '#000', width: 380, height: 760 }}
              >
                {/* Remount on tab change so each demo starts fresh */}
                <div
                  key={active}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    transform: 'scale(0.89)',
                    transformOrigin: 'top left',
                    width: '112%',
                    height: '112%',
                  }}
                >
                  {active === 'object' && <ButterflyObject />}
                  {active === 'banking' && <ButterflyBanking />}
                  {active === 'ticket' && <ButterflyTicket />}
                </div>
              </div>
              {/* Dynamic island */}
              <div
                className="absolute top-[22px] left-1/2 -translate-x-1/2 h-[24px] w-[100px] rounded-full z-10 pointer-events-none"
                style={{ background: '#000' }}
              />
            </div>

            {/* Floating tip */}
            <div
              className="hidden lg:flex absolute -right-4 top-[52%] items-center gap-2 px-3 py-2 rounded-full bg-white border border-hair shadow-lg animate-pulse"
              style={{ animationDuration: '2.2s' }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M4 7 L10 7 M7 4 L10 7 L7 10"
                  stroke="#0A4AD6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[11px] font-bold text-accent tracking-wider uppercase">
                Tap it
              </span>
            </div>
          </div>
        </div>

        {/* Bottom strip — quick summary of each */}
        <FadeIn delay={0.25}>
          <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-[960px] mx-auto">
            {tabs.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className="card card-hover text-left p-5 transition-all"
                  style={{
                    borderColor: isActive ? 'var(--color-accent)' : 'var(--color-hair)',
                    boxShadow: isActive
                      ? '0 8px 24px -8px rgba(10,74,214,0.25)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold rounded-full px-2 py-0.5"
                      style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
                    >
                      {t.key === 'object' ? 'V4' : t.key === 'banking' ? 'V5' : 'V6'}
                    </span>
                    <span className="text-caption text-[11px] uppercase tracking-widest font-bold">
                      {t.sublabel}
                    </span>
                  </div>
                  <h3 className="text-ink font-bold text-[18px] mb-2">{t.label}</h3>
                  <p className="text-muted text-[13px] leading-relaxed">{t.metaphor}</p>
                </button>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
