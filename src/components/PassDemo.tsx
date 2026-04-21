// @ts-ignore — JSX import
import ButterflyPass from '../v3_pass.jsx';

/**
 * /partner embed — V3 The Pass, for the compliance / enterprise audience.
 * Shows what gets logged: nothing but anonymous, auditable, 90-day-purged metadata.
 */
export default function PassDemo() {
  return (
    <section className="section bg-bg-muted/40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 100% 50%, rgba(10,74,214,0.08), transparent 70%)',
        }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 items-center">
          {/* Phone */}
          <div className="relative mx-auto order-2 lg:order-1">
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
                style={{ background: '#000', width: 380, height: 760 }}
              >
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ transform: 'scale(0.89)', transformOrigin: 'top left', width: '112%', height: '112%' }}
                >
                  <ButterflyPass />
                </div>
              </div>
              <div
                className="absolute top-[22px] left-1/2 -translate-x-1/2 h-[24px] w-[100px] rounded-full z-10 pointer-events-none"
                style={{ background: '#000' }}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="max-w-[540px] order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hair shadow-sm text-ink/80 font-semibold text-[12px] tracking-[0.08em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              For your General Counsel
            </span>
            <h2 className="mb-5">
              What gets logged. <span className="text-accent">Nothing more.</span>
            </h2>
            <p className="text-[17px] md:text-[19px] text-muted leading-relaxed mb-8">
              Run a check-in. Watch the pass build itself field by field. When the pass seals, it carries exactly what an auditor needs — and nothing that would harm the person on the other end of the conversation.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { bold: 'No name.', rest: 'Ever. Not stored, not hashed.' },
                { bold: 'No notes, no diagnosis.', rest: 'Just elapsed time and route taken.' },
                { bold: 'Cannot be used in performance reviews.', rest: 'Legal firewall is baked in.' },
                { bold: 'Auto-purges in 90 days.', rest: 'Default behavior. Not opt-in.' },
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-ink text-[15px]">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-light shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke="#0A4AD6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span><strong className="font-semibold">{b.bold}</strong> <span className="text-muted">{b.rest}</span></span>
                </li>
              ))}
            </ul>
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-hair">
              <span className="text-[11px] font-bold text-caption tracking-[0.22em] uppercase">Aligned with</span>
              <span className="text-[12px] font-bold text-ink">OSHA · ADA · HIPAA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
