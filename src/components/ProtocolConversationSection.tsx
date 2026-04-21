import { useState, useEffect } from 'react';
import { FadeIn } from './shared';
import PhoneFrame from './PhoneFrame';
// @ts-ignore — JSX import
import ButterflyConversation from '../v1_conversation.jsx';

/**
 * /protocol — V1 Conversation, framed as "see the 4 steps play out in a real chat."
 * Phone centered, Step 1+2 on the left, Step 3+4 on the right.
 * Animated dashed connectors link each callout to the phone.
 */
export default function ProtocolConversationSection() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-bg-muted/30 to-white">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 right-[15%] w-[480px] h-[480px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(10,74,214,0.18), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 left-[10%] w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(232,238,251,0.9), transparent 70%)' }}
        />
      </div>

      <div className="container relative">
        {/* Heading */}
        <div className="text-center max-w-[760px] mx-auto mb-14 md:mb-16">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hair shadow-sm text-ink/80 font-semibold text-[12px] tracking-[0.08em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live demo · Try the protocol
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="mb-5 mx-auto">
              Now watch it happen in a <span className="text-accent">real conversation.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[16px] md:text-[18px] text-muted mx-auto max-w-[600px] leading-relaxed">
              The same four steps, embedded in a real text thread. No slides, no abstractions.
              Tap the blue prompt at the bottom of the phone and run through the whole protocol yourself —
              from the first message to the sealed audit receipt.
            </p>
          </FadeIn>
        </div>

        {/* Phone stage — phone centered, callouts on sides */}
        <div className="relative flex justify-center items-start">

          {/* ── LEFT SIDE: Step 1 (top) + Step 2 (below) ── */}
          <div
            className="hidden xl:flex flex-col items-end gap-6 absolute text-right"
            style={{
              right: 'calc(50% + 220px)',
              top: '5%',
              width: 220,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            {/* Step 1 */}
            <div
              className="w-full"
              style={{
                animation: visible ? 'slideInLeft 0.5s ease 0.2s both' : 'none',
              }}
            >
              <div className="rounded-2xl bg-white border border-hair shadow-md p-4 relative">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Step 1 · See
                </span>
                <p className="text-[13px] text-ink font-medium leading-snug">
                  System lines in gray show signals: Jamie missed two standups.
                </p>
              </div>
              {/* Connector arrow pointing right toward phone */}
              <div className="flex justify-end mt-2 mr-[-8px]">
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path
                    d="M2 8 Q 35 20, 68 12"
                    stroke="#0A4AD6"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: visible ? 0 : 100,
                      transition: 'stroke-dashoffset 1s ease 0.75s',
                    }}
                  />
                  <circle cx="68" cy="12" r="2.5" fill="#0A4AD6" opacity="0.7" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="w-full"
              style={{
                animation: visible ? 'slideInLeft 0.5s ease 0.45s both' : 'none',
              }}
            >
              <div className="rounded-2xl bg-white border border-hair shadow-md p-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Step 2 · Stay
                </span>
                <p className="text-[13px] text-ink font-medium leading-snug">
                  You send the opening message — the door is open, no pressure.
                </p>
              </div>
              {/* Connector */}
              <div className="flex justify-end mt-2 mr-[-8px]">
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path
                    d="M2 8 Q 35 20, 68 12"
                    stroke="#0A4AD6"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: visible ? 0 : 100,
                      transition: 'stroke-dashoffset 1s ease 0.75s',
                    }}
                  />
                  <circle cx="68" cy="12" r="2.5" fill="#0A4AD6" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── CENTER: iPhone 17 Pro mockup ── */}
          <div className="relative flex flex-col items-center">
            <PhoneFrame width={400}>
              <ButterflyConversation />
            </PhoneFrame>

            {/* "Tap" hint below the phone */}
            <div className="flex justify-center mt-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent/30 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-bounce">
                  <path d="M7 2 L7 10 M3 6 L7 10 L11 6" stroke="#0A4AD6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12px] font-bold text-accent tracking-wider uppercase">
                  Tap the blue prompt to begin
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE: Step 3 (top) + Step 4 (below) ── */}
          <div
            className="hidden xl:flex flex-col items-start gap-6 absolute"
            style={{
              left: 'calc(50% + 220px)',
              top: '30%',
              width: 220,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            {/* Step 3 */}
            <div
              className="w-full"
              style={{
                animation: visible ? 'slideInRight 0.5s ease 0.35s both' : 'none',
              }}
            >
              {/* Connector pointing left toward phone */}
              <div className="flex justify-start mb-2 ml-[-8px]">
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path
                    d="M68 12 Q 35 4, 2 12"
                    stroke="#0A4AD6"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: visible ? 0 : 100,
                      transition: 'stroke-dashoffset 1s ease 0.9s',
                    }}
                  />
                  <circle cx="2" cy="12" r="2.5" fill="#0A4AD6" opacity="0.7" />
                </svg>
              </div>
              <div className="rounded-2xl bg-white border border-hair shadow-md p-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Step 3 · Ask
                </span>
                <p className="text-[13px] text-ink font-medium leading-snug">
                  Offer a resource — 988, EAP, or on-site counselor. One tap.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className="w-full"
              style={{
                animation: visible ? 'slideInRight 0.5s ease 0.6s both' : 'none',
              }}
            >
              {/* Connector */}
              <div className="flex justify-start mb-2 ml-[-8px]">
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path
                    d="M68 12 Q 35 4, 2 12"
                    stroke="#0A4AD6"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: visible ? 0 : 100,
                      transition: 'stroke-dashoffset 1s ease 0.9s',
                    }}
                  />
                  <circle cx="2" cy="12" r="2.5" fill="#0A4AD6" opacity="0.7" />
                </svg>
              </div>
              <div className="rounded-2xl bg-white border border-hair shadow-md p-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Step 4 · Connect
                </span>
                <p className="text-[13px] text-ink font-medium leading-snug">
                  The final receipt: no PII, 90-day auto-purge, OSHA · ADA · HIPAA aligned.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Trust row below phone */}
        <FadeIn delay={0.5}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-caption text-[13px]">
            {['Runs in under 30 seconds', 'No PII recorded', 'Auto-purges in 90 days', 'OSHA · ADA · HIPAA aligned'].map((t, i, arr) => (
              <span key={t} className="inline-flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t}
                {i < arr.length - 1 && <span className="hidden md:inline text-hair ml-6">·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}