// @ts-ignore — JSX import
import ButterflyConversation from '../v1_conversation.jsx';

/**
 * Homepage embed — V1 The Conversation in a phone-shaped frame.
 * Shows the protocol as a live iMessage flow with Jamie.
 */
export default function ConversationDemo() {
  return (
    <section className="section bg-bg-muted/60 relative overflow-hidden">
      {/* Soft ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(10,74,214,0.10), transparent 70%)',
        }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div className="max-w-[540px]">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hair shadow-sm text-ink/80 font-semibold text-[12px] tracking-[0.08em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live demo · Try the protocol
            </span>
            <h2 className="mb-5">
              See it work in <span className="text-accent">30 seconds.</span>
            </h2>
            <p className="text-[17px] md:text-[19px] text-muted leading-relaxed mb-8">
              A real check-in, embedded in a real chat. No slides. No abstractions. Tap the blue prompt at the bottom of the phone and run through the protocol yourself — from the first message to the sealed audit receipt.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Script to send — pre-written, editable',
                'Route to one resource — 988, EAP, or counselor',
                'Log the outcome — anonymous, auto-purged in 90 days',
                'Receipt auto-sealed — OSHA · ADA · HIPAA aligned',
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-ink text-[15px]">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-light shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke="#0A4AD6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-caption italic">
              Timer starts when you tap the first suggestion. Watch yourself run it in under a minute.
            </p>
          </div>

          {/* Phone frame containing V1 */}
          <div className="relative mx-auto">
            {/* Device bezel */}
            <div
              className="relative rounded-[52px] p-[10px] mx-auto"
              style={{
                width: 400,
                background: 'linear-gradient(180deg, #1a1a1c, #0a0a0c)',
                boxShadow:
                  '0 30px 80px -20px rgba(11,11,15,0.35), 0 4px 0 rgba(255,255,255,0.04) inset',
              }}
            >
              <div
                className="relative rounded-[44px] overflow-hidden"
                style={{
                  background: '#000',
                  width: 380,
                  height: 760,
                }}
              >
                {/* Embedded V1 */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ transform: 'scale(0.89)', transformOrigin: 'top left', width: '112%', height: '112%' }}
                >
                  <ButterflyConversation />
                </div>
              </div>
              {/* Dynamic island */}
              <div
                className="absolute top-[22px] left-1/2 -translate-x-1/2 h-[24px] w-[100px] rounded-full z-10 pointer-events-none"
                style={{ background: '#000' }}
              />
            </div>

            {/* Floating "tap this" hint */}
            <div
              className="absolute -left-2 top-[60%] hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-hair shadow-lg animate-pulse"
              style={{ animationDuration: '2.2s' }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M10 7 L4 7 M7 4 L4 7 L7 10" stroke="#0A4AD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] font-bold text-accent tracking-wider uppercase">
                Tap me
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
