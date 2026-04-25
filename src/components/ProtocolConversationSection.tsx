import { useState, useEffect } from 'react';
import { FadeIn } from './shared';
// @ts-ignore — JSX import
import ButterflyConversation from '../v1_conversation.jsx';

/**
 * /protocol — V1 Conversation, framed as "see the 4 steps play out in a real chat."
 * Phone centered, Step 1+2 on the left, Step 3+4 on the right.
 * Animated dashed connectors link each callout to the phone.
 *
 * `embedded` mode: hides the redundant top heading + the 4 step callouts and
 * tightens the section padding, so this component can be rendered inside the
 * walkthrough's post-Finish overlay (which has its own header) and fit no-scroll.
 */
export default function ProtocolConversationSection({ embedded = false }: { embedded?: boolean } = {}) {

  const [visible, setVisible] = useState(false);
  const [jamieOnline, setJamieOnline] = useState(false);
  const [phase, setPhase] = useState<string>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Emotional lighting: tension layer peaks while Jamie hasn't replied yet (waiting / sent).
  // Warm layer peaks once connection happens (replied / sheet3 / outcome). Done → warm afterglow.
  const tensionOpacity = phase === 'waiting' || phase === 'sent' ? 0.55 : 0;
  const warmOpacity = phase === 'replied' || phase === 'sheet3' || phase === 'outcome' ? 0.5 : 0;
  const doneOpacity = phase === 'done' ? 0.65 : 0;

  // Jamie's micro-status — reflects real presence, not a generic "typing"
  type JamieStatus = { text: string; tone: 'offline' | 'considering' | 'present' | 'listening' };
  const jamieStatus: JamieStatus =
    phase === 'waiting' || phase === 'sent'
      ? { text: 'Jamie is considering…', tone: 'considering' }
      : phase === 'replied' || phase === 'sheet3'
        ? { text: 'Jamie is present', tone: 'present' }
        : phase === 'outcome'
          ? { text: 'Jamie is here with you', tone: 'present' }
          : phase === 'done'
            ? { text: 'Listening', tone: 'listening' }
            : jamieOnline
              ? { text: 'online now', tone: 'present' }
              : { text: 'quiet this week · last seen 2h ago', tone: 'offline' };

  return (
    <section
      className={`relative overflow-hidden ${embedded ? 'py-6 md:py-10' : 'py-20 md:py-28'}`}
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 38%, #fbf4ea 0%, #f1e7d4 45%, #e6d9c2 75%, #d6c6aa 100%)',
      }}
    >
      {/* Focal warm light pool — centered on Jamie's presence */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '18%',
            width: 900,
            height: 900,
            borderRadius: '50%',
            filter: 'blur(60px)',
            background:
              'radial-gradient(circle, rgba(255,210,140,0.55) 0%, rgba(255,180,110,0.28) 30%, rgba(235,150,90,0.10) 55%, transparent 75%)',
            mixBlendMode: 'multiply',
            opacity: 0.9,
          }}
        />
        {/* Second subtle warm bloom — closer to Jamie's head */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '22%',
            width: 360,
            height: 360,
            borderRadius: '50%',
            filter: 'blur(50px)',
            background:
              'radial-gradient(circle, rgba(255,170,100,0.35) 0%, rgba(230,140,90,0.18) 40%, transparent 75%)',
          }}
        />
        {/* Vignette — dim the far corners so the room feels enclosed */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 100% 90% at 50% 45%, transparent 55%, rgba(60,40,20,0.08) 78%, rgba(40,25,10,0.18) 100%)',
          }}
        />
        {/* Subtle grain — tactile/paper feel */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
          }}
        />

        {/* ── Ambient emotional lighting — three overlay layers that crossfade with phase ── */}
        {/* Tension layer: desaturated cool wash, rises while Jamie hasn't replied yet */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(160,170,180,0.28) 0%, rgba(120,130,150,0.18) 45%, rgba(80,90,110,0.10) 80%, transparent 100%)',
            mixBlendMode: 'multiply',
            opacity: tensionOpacity,
            transition: 'opacity 2200ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        {/* Warm-connection layer: amber bloom that rises once Jamie responds */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,170,95,0.40) 0%, rgba(240,140,80,0.20) 40%, transparent 75%)',
            mixBlendMode: 'screen',
            opacity: warmOpacity,
            transition: 'opacity 2800ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        {/* Done/afterglow: golden satisfaction, strongest of the three */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(255,200,110,0.45) 0%, rgba(240,170,90,0.22) 45%, transparent 80%)',
            mixBlendMode: 'screen',
            opacity: doneOpacity,
            transition: 'opacity 3200ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      <div className="container relative">
        {/* Heading — hidden in embedded mode (the walkthrough overlay's own header takes over) */}
        {!embedded && (
        <div className="text-center max-w-[760px] mx-auto mb-14 md:mb-16">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hair shadow-sm text-ink/80 font-semibold text-[12px] tracking-[0.08em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live demo · Try the protocol
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="mb-5 mx-auto">
              Now <span className="text-accent">you</span> have the conversation.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[16px] md:text-[18px] text-muted mx-auto max-w-[600px] leading-relaxed">
              Someone you work with has been quiet. You've noticed.
              This is the moment you reach out — the same four steps, lived in first person,
              from the first message to the sealed audit receipt.
            </p>
          </FadeIn>
        </div>
        )}

        {/* Phone stage — phone centered, callouts on sides */}
        <div className="relative flex justify-center items-start">

          {/* ── LEFT SIDE: Step 1 (top) + Step 2 (below) — hidden in embedded mode ── */}
          {!embedded && (
          <div
            className="hidden xl:flex flex-col items-end gap-6 absolute text-right"
            style={{
              right: 'calc(50% + 300px)',
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
          )}

          {/* ── CENTER: Immersive first-person scene — no card, no chrome ── */}
          <div className="relative flex flex-col items-center" style={{ width: 560 }}>

            {/* Internal-state cue — what you're thinking right before you reach out */}
            <div
              className="mb-4 text-center text-[13px] italic text-muted/80"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.8s ease 0.15s',
              }}
            >
              You've been thinking about them all morning.
            </div>

            {/* Message card — Jamie's profile lives INSIDE the card as its header,
                so it reads as one unified surface rather than a floating presence above
                a separate conversation. The receipt overlay only covers the message area
                below, leaving Jamie's header persistently visible. */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                borderRadius: 22,
                background: 'transparent',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
              }}
            >
              {/* Jamie header — integrated into the card. Fades out when the notification/receipt
                  is visible so those can hold the spotlight, then fades back in when dismissed. */}
              <div
                className="flex items-center gap-4 px-6 pt-5 pb-4"
                style={{
                  borderBottom: '1px solid rgba(180,150,100,0.15)',
                  opacity: receiptOpen ? 0 : 1,
                  transform: receiptOpen ? 'translateY(-6px)' : 'translateY(0)',
                  pointerEvents: receiptOpen ? 'none' : 'auto',
                  transition: 'opacity 900ms cubic-bezier(0.4,0,0.2,1), transform 900ms cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Avatar with warm halo */}
                <div className="relative shrink-0 flex-none">
                  <div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(217,18,187,0.35), transparent 70%)',
                      transform: 'scale(1.8)',
                    }}
                  />
                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-full text-[22px] font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #d912bb, #70046e)',
                      boxShadow: '0 6px 18px -6px rgba(112,4,110,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                  >
                    J
                  </div>
                </div>
                {/* Name + dynamic status */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-[18px] font-semibold text-ink leading-tight">Jamie</div>
                  <div
                    key={jamieStatus.text}
                    className="mt-0.5 flex items-center gap-1.5 text-[12px]"
                    style={{
                      color:
                        jamieStatus.tone === 'offline' ? 'rgba(100,80,60,0.55)' :
                        jamieStatus.tone === 'considering' ? '#b4864f' :
                        jamieStatus.tone === 'listening' ? '#78653f' :
                        '#059669',
                      fontWeight: jamieStatus.tone === 'offline' ? 400 : 500,
                      animation: 'bf-fade 700ms ease both',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          jamieStatus.tone === 'offline' ? 'rgba(120,100,80,0.4)' :
                          jamieStatus.tone === 'considering' ? '#d19753' :
                          jamieStatus.tone === 'listening' ? '#8a7650' :
                          '#10b981',
                        boxShadow:
                          jamieStatus.tone === 'offline' ? 'none' :
                          jamieStatus.tone === 'considering' ? '0 0 0 3px rgba(209,151,83,0.22)' :
                          jamieStatus.tone === 'listening' ? '0 0 0 3px rgba(138,118,80,0.22)' :
                          '0 0 0 3px rgba(16,185,129,0.25)',
                        animation:
                          jamieStatus.tone === 'considering' ? 'bf-dot 1.2s infinite' :
                          jamieStatus.tone === 'offline' ? 'none' :
                          'bf-dot 1.8s infinite',
                      }}
                    />
                    {jamieStatus.text}
                  </div>
                </div>
                {/* Live timer — sits at the right of the header, aligned with Jamie's profile.
                    Appears only while the protocol is actively running (after first tap, before done). */}
                <div
                  className="flex items-center gap-1.5 shrink-0 text-[12px] tabular-nums"
                  style={{
                    opacity: timerActive ? 1 : 0,
                    transition: 'opacity 500ms ease',
                    color: 'rgba(100,75,45,0.7)',
                  }}
                  aria-hidden={!timerActive}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#0A4AD6', animation: 'bf-dot 1.2s infinite' }}
                  />
                  <span className="font-semibold" style={{ color: '#0A4AD6' }}>
                    {elapsed.toFixed(1)}s
                  </span>
                </div>
              </div>

              {/* The conversation itself. In embedded mode, the chat min-height
                  scales with the viewport so the whole card fits no-scroll on
                  shorter screens, while still using the full 620px on tall ones. */}
              <ButterflyConversation
                naked
                minHeight={embedded ? 'min(720px, calc(100vh - 260px))' : undefined}
                onFirstMessage={() => setJamieOnline(true)}
                onPhaseChange={setPhase}
                onElapsed={(e: number, active: boolean) => {
                  setElapsed(e);
                  setTimerActive(active);
                }}
                onReceiptVisibleChange={setReceiptOpen}
              />

              {/* Compliance footer — promises from the receipt, persistently visible in the flow */}
              <div
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-5 pt-3 pb-5 text-[11px]"
                style={{
                  borderTop: '1px solid rgba(180,150,100,0.15)',
                  color: 'rgba(100,75,45,0.72)',
                }}
              >
                {[
                  'No name recorded',
                  'No notes, no diagnosis',
                  'Auto-purges in 90 days',
                  'OSHA · ADA · HIPAA',
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 5 L4 7 L8 3" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Your-turn cue — first-person prompt. Hidden in embedded mode (the
                user is already inside the demo, no longer needs an entry cue). */}
            {!embedded && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-accent tracking-wider uppercase">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-bounce">
                    <path d="M7 2 L7 10 M3 6 L7 10 L11 6" stroke="#0A4AD6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  It's your turn — reach out
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDE: Step 3 (top) + Step 4 (below) — hidden in embedded mode ── */}
          {!embedded && (
          <div
            className="hidden xl:flex flex-col items-start gap-6 absolute"
            style={{
              left: 'calc(50% + 300px)',
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
          )}

        </div>

        {/* Recent check-ins — quiet proof of scale. Hidden in embedded mode to
            preserve no-scroll fit inside the walkthrough's post-Finish overlay. */}
        {!embedded && (
        <FadeIn delay={0.5}>
          <div className="mt-16 flex flex-col items-center">
            <div
              className="text-[11px] font-semibold uppercase mb-4"
              style={{ color: 'rgba(100,75,45,0.6)', letterSpacing: '0.14em' }}
            >
              Recent check-ins
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { initials: 'A', name: 'Alex',    outcome: '28s · accepted',              gradient: 'linear-gradient(135deg, #10b981, #047857)', tone: 'accepted' as const },
                { initials: 'P', name: 'Priya',   outcome: '41s · declined · escalated',  gradient: 'linear-gradient(135deg, #f59e0b, #b45309)', tone: 'escalated' as const },
                { initials: 'M', name: 'Marcus',  outcome: '19s · accepted',              gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)', tone: 'accepted' as const },
                { initials: 'S', name: 'Sam',     outcome: '35s · accepted',              gradient: 'linear-gradient(135deg, #8b5cf6, #5b21b6)', tone: 'accepted' as const },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2.5 rounded-full px-3 py-1.5"
                  style={{
                    background: 'rgba(255,251,240,0.5)',
                    border: '1px solid rgba(180,150,100,0.18)',
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shrink-0"
                    style={{ background: c.gradient }}
                  >
                    {c.initials}
                  </div>
                  <span className="text-[12.5px] font-semibold text-ink">{c.name}</span>
                  <span
                    className="text-[11.5px]"
                    style={{ color: c.tone === 'escalated' ? 'rgba(180,110,40,0.85)' : 'rgba(100,75,45,0.65)' }}
                  >
                    {c.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        )}
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