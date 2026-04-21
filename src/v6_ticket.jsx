import { useState, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────
// BUTTERFLY — V6 THE TICKET
// A paper-style civic ticket that tears along perforations as the
// protocol progresses. Editorial typography. Feels like a museum
// ticket or a civic document — which fits the "this is a civic
// protocol, like CPR" positioning for billionaires.
// ────────────────────────────────────────────────────────────────────

const TEAL = '#0A4AD6';       // slightly deeper, more "ink" than "brand"
const TEAL_BR = '#3D6FE5';
const INK = '#1A1A1A';
const INK_2 = '#5C5C5C';
const INK_3 = '#A0A0A0';
const HAIR = '#D4D1CA';       // warm separator for paper feel
const PAPER = '#F6F3EC';      // warm off-white paper
const PAPER_DEEP = '#EEE9DE'; // slightly deeper for the torn stub
const STAMP_RED = '#B8463A';

const Mark = ({ size = 18, color = TEAL }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

export default function ButterflyTicket() {
  const [phase, setPhase] = useState('idle');
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [route, setRoute] = useState(null);
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    if (startedAt === null || phase === 'validated') return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => clearInterval(id);
  }, [startedAt, phase]);

  const begin = () => { setStartedAt(Date.now()); setPhase('approach'); };
  const reset = () => { setPhase('idle'); setStartedAt(null); setElapsed(0); setRoute(null); setAccepted(null); };

  const tearCount = {
    idle: 0, approach: 0, listen: 1, route: 2, outcome: 3, validated: 4,
  }[phase];

  // Serial number — deterministic so it feels real across the run
  const serial = 'BF-2026-000847';

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 30% 0%, rgba(255,255,255,0.6), transparent 50%),
          linear-gradient(180deg, #E4DFD3, #D6D1C4)
        `,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
        color: INK,
        padding: '24px 16px',
      }}
    >
      <style>{`
        @keyframes bft-content-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bft-tear { 0% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-40px) rotate(-4deg); opacity: 0; } }
        @keyframes bft-stamp-drop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(2.4) rotate(-8deg); }
          55% { opacity: 1; transform: translate(-50%, -50%) scale(0.88) rotate(-6deg); }
          80% { transform: translate(-50%, -50%) scale(1.03) rotate(-7deg); }
          100% { opacity: 0.92; transform: translate(-50%, -50%) scale(1) rotate(-7deg); }
        }
        @keyframes bft-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .bft-in { animation: bft-content-in 500ms cubic-bezier(0.16,1,0.3,1) both; }
        .bft-in-1 { animation: bft-content-in 500ms cubic-bezier(0.16,1,0.3,1) 80ms both; }
        .bft-in-2 { animation: bft-content-in 500ms cubic-bezier(0.16,1,0.3,1) 160ms both; }
        .bft-in-3 { animation: bft-content-in 500ms cubic-bezier(0.16,1,0.3,1) 240ms both; }
        .bft-stamp { animation: bft-stamp-drop 700ms cubic-bezier(0.3,1.4,0.4,1) 300ms both; }

        /* Paper grain texture */
        .bft-paper {
          position: relative;
        }
        .bft-paper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.02) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(0,0,0,0.02) 0%, transparent 40%),
            radial-gradient(circle at 45% 15%, rgba(0,0,0,0.015) 0%, transparent 30%);
          pointer-events: none;
          mix-blend-mode: multiply;
        }
      `}</style>

      <div className="relative w-full" style={{ maxWidth: '400px' }}>
        {/* Ticket shadow */}
        <div
          className="absolute inset-0 rounded-[14px]"
          style={{
            background: 'rgba(0,0,0,0.35)',
            filter: 'blur(30px)',
            transform: 'translateY(20px) scale(0.95)',
            opacity: 0.4,
          }}
        />

        {/* THE TICKET */}
        <div
          className="relative bft-paper overflow-hidden rounded-[14px]"
          style={{
            background: PAPER,
            boxShadow: '0 2px 1px rgba(255,255,255,0.6) inset, 0 30px 60px -20px rgba(60, 50, 30, 0.3)',
          }}
        >
          {/* Scalloped top edge */}
          <ScallopEdge position="top" color={PAPER} />

          {/* MAIN BODY */}
          <div className="px-7 pt-7 pb-4">
            {/* Letterhead */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Mark size={14} color={INK} />
                  <span className="text-[9px] font-bold uppercase" style={{ color: INK, letterSpacing: '0.2em' }}>
                    Butterfly Protocol
                  </span>
                </div>
                <p className="mt-0.5 text-[8px]" style={{ color: INK_2, letterSpacing: '0.14em' }}>
                  CIVIC · EST. 2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.18em' }}>Serial</p>
                <p className="text-[10px] font-semibold tabular-nums" style={{ color: INK, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', letterSpacing: '0.02em' }}>
                  {serial}
                </p>
              </div>
            </div>

            {/* Divider — editorial double rule */}
            <div className="mt-4 pb-4" style={{ borderBottom: `2px solid ${INK}` }}>
              <div className="pb-[2px]" style={{ borderBottom: `1px solid ${INK}` }} />
            </div>

            {/* Phase-dependent content */}
            <div key={phase} className="min-h-[280px] pt-5">
              {phase === 'idle' && <IdleBody onBegin={begin} />}
              {phase === 'approach' && <ApproachBody onNext={() => setPhase('listen')} />}
              {phase === 'listen' && <ListenBody onNext={() => setPhase('route')} />}
              {phase === 'route' && <RouteBody onPick={(r) => { setRoute(r); setPhase('outcome'); }} />}
              {phase === 'outcome' && <OutcomeBody route={route} onPick={(a) => { setAccepted(a); setElapsed((Date.now() - startedAt) / 1000); setPhase('validated'); }} />}
              {phase === 'validated' && <ValidatedBody elapsed={elapsed} route={route} accepted={accepted} onReset={reset} />}
            </div>
          </div>

          {/* Perforation line — divides body from stub */}
          <div className="relative">
            <PerforationLine />
            <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full" style={{ background: '#DCD7C8' }} />
            <span className="absolute -right-[9px] top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full" style={{ background: '#DCD7C8' }} />
          </div>

          {/* STUB — shows step counters / protocol map */}
          <div
            className="relative px-7 py-4"
            style={{ background: PAPER_DEEP }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[8px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.2em' }}>Protocol</p>
                <div className="mt-1.5 flex gap-2">
                  {[
                    { n: 'I', l: 'APPROACH' },
                    { n: 'II', l: 'LISTEN' },
                    { n: 'III', l: 'ROUTE' },
                    { n: 'IV', l: 'LOG' },
                  ].map((s, i) => {
                    const torn = i < tearCount;
                    return (
                      <div key={s.n} className="flex-1 text-center relative">
                        <div
                          className="relative rounded-sm px-1 py-1.5"
                          style={{
                            background: torn ? TEAL : 'transparent',
                            border: torn ? `1px solid ${TEAL}` : `1px dashed ${INK_3}`,
                            transition: 'all 400ms ease',
                          }}
                        >
                          <p
                            className="text-[10px] font-black tabular-nums"
                            style={{ color: torn ? 'white' : INK, letterSpacing: '0.04em' }}
                          >
                            {s.n}
                          </p>
                          <p
                            className="text-[6px] font-bold uppercase mt-0.5"
                            style={{ color: torn ? 'rgba(255,255,255,0.7)' : INK_3, letterSpacing: '0.1em' }}
                          >
                            {s.l}
                          </p>
                          {torn && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: 'repeating-linear-gradient(-45deg, transparent 0 3px, rgba(255,255,255,0.08) 3px 4px)',
                                borderRadius: '2px',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.2em' }}>Elapsed</p>
                <p className="text-[14px] font-semibold tabular-nums" style={{ color: phase === 'validated' ? TEAL : INK, letterSpacing: '0.02em' }}>
                  {elapsed.toFixed(1)} <span className="text-[9px] font-normal" style={{ color: INK_2 }}>sec</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.2em' }}>Compliance</p>
                <p className="text-[9px] font-semibold" style={{ color: INK, letterSpacing: '0.04em' }}>
                  OSHA · ADA · HIPAA
                </p>
              </div>
            </div>
          </div>

          {/* Scalloped bottom edge */}
          <ScallopEdge position="bottom" color={PAPER_DEEP} />

          {/* VALIDATED STAMP — overlays everything when sealed */}
          {phase === 'validated' && (
            <div
              className="pointer-events-none absolute bft-stamp"
              style={{
                top: '42%',
                left: '50%',
                transformOrigin: 'center',
              }}
            >
              <div
                className="rounded px-4 py-2.5 border-[3px]"
                style={{
                  borderColor: STAMP_RED,
                  background: 'rgba(255,245,240,0.15)',
                  mixBlendMode: 'multiply',
                }}
              >
                <p className="text-[18px] font-black" style={{ color: STAMP_RED, letterSpacing: '0.18em' }}>
                  VALIDATED
                </p>
                <p className="text-[8px] font-bold text-center" style={{ color: STAMP_RED, letterSpacing: '0.24em' }}>
                  BUTTERFLY · SEALED
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── BODY CONTENT ───────────────────────────

function IdleBody({ onBegin }) {
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.22em' }}>
        Admit one · The protocol
      </p>
      <h1 className="bft-in-1 mt-2 text-[42px] font-semibold leading-[0.95]" style={{ letterSpacing: '-0.035em', color: INK }}>
        One<br />check-in.
      </h1>
      <p className="bft-in-2 mt-4 text-[13px] leading-[1.5]" style={{ color: INK_2, letterSpacing: '-0.005em' }}>
        Watch an audit-ready record come into being as you run the Butterfly Protocol — the civic first-response framework for workplace mental health.
      </p>

      <div className="bft-in-3 mt-5 grid grid-cols-3 gap-2">
        {['30 sec', 'Zero PII', '90-day purge'].map((t) => (
          <div key={t} className="rounded-sm py-1.5 text-center" style={{ border: `1px solid ${INK_3}` }}>
            <p className="text-[9.5px] font-bold uppercase" style={{ color: INK, letterSpacing: '0.06em' }}>{t}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onBegin}
          className="w-full rounded-sm py-[15px] text-[13px] font-bold uppercase transition-transform active:scale-[0.98]"
          style={{
            background: INK,
            color: PAPER,
            letterSpacing: '0.16em',
          }}
        >
          Tear & Begin →
        </button>
      </div>
    </div>
  );
}

function ApproachBody({ onNext }) {
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: TEAL, letterSpacing: '0.22em' }}>
        Act I · Approach
      </p>
      <h2 className="bft-in-1 mt-2 text-[32px] font-semibold leading-[1.02]" style={{ letterSpacing: '-0.028em', color: INK }}>
        Name what<br />you saw.
      </h2>

      <div
        className="bft-in-2 mt-5 relative px-4 py-4"
        style={{
          background: 'white',
          border: `1px solid ${HAIR}`,
        }}
      >
        <span
          className="absolute -top-2 left-3 px-2 text-[8px] font-bold uppercase"
          style={{ background: PAPER, color: INK_2, letterSpacing: '0.14em' }}
        >
          Try saying
        </span>
        <p className="text-[14px] leading-[1.4]" style={{ color: INK, fontStyle: 'italic' }}>
          "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?"
        </p>
      </div>

      <p className="bft-in-3 mt-3 text-[11px]" style={{ color: INK_2, letterSpacing: '-0.005em' }}>
        Specificity beats sympathy. Generic concern feels performative.
      </p>

      <div className="mt-auto pt-5">
        <button
          onClick={onNext}
          className="w-full rounded-sm py-[14px] text-[12px] font-bold uppercase transition-transform active:scale-[0.98]"
          style={{
            background: INK,
            color: PAPER,
            letterSpacing: '0.16em',
          }}
        >
          I said it → tear next
        </button>
      </div>
    </div>
  );
}

function ListenBody({ onNext }) {
  const items = ['LET THEM TALK', 'NO ADVICE', 'SILENCE IS OK'];
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: TEAL, letterSpacing: '0.22em' }}>
        Act II · Listen
      </p>
      <h2 className="bft-in-1 mt-2 text-[32px] font-semibold leading-[1.02]" style={{ letterSpacing: '-0.028em', color: INK }}>
        Don't fix.<br />Don't diagnose.
      </h2>

      <div className="bft-in-2 mt-5 divide-y" style={{ borderColor: HAIR }}>
        {items.map((t, i) => (
          <div
            key={t}
            className="flex items-center gap-3 py-2.5"
            style={{ borderTop: i === 0 ? `1px solid ${HAIR}` : 'none', borderBottom: `1px solid ${HAIR}` }}
          >
            <span className="text-[10px] font-bold tabular-nums" style={{ color: TEAL, letterSpacing: '0.08em' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[12px] font-bold uppercase" style={{ color: INK, letterSpacing: '0.08em' }}>
              {t}
            </span>
          </div>
        ))}
      </div>

      <p className="bft-in-3 mt-3 text-[11px]" style={{ color: INK_2, letterSpacing: '-0.005em' }}>
        You're the router, not the therapist. That's what makes it work.
      </p>

      <div className="mt-auto pt-5">
        <button
          onClick={onNext}
          className="w-full rounded-sm py-[14px] text-[12px] font-bold uppercase transition-transform active:scale-[0.98]"
          style={{
            background: INK,
            color: PAPER,
            letterSpacing: '0.16em',
          }}
        >
          I listened → tear next
        </button>
      </div>
    </div>
  );
}

function RouteBody({ onPick }) {
  const resources = [
    { key: '988', n: 'A', title: '988 LIFELINE', sub: '24/7 crisis · free · call or text', short: '988' },
    { key: 'eap', n: 'B', title: 'LYRA HEALTH', sub: 'EAP · confidential · free', short: 'Lyra' },
    { key: 'kim', n: 'C', title: 'DR. KIM', sub: 'On-site · Wed & Fri', short: 'Dr. Kim' },
  ];
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: TEAL, letterSpacing: '0.22em' }}>
        Act III · Route
      </p>
      <h2 className="bft-in-1 mt-2 text-[32px] font-semibold leading-[1.02]" style={{ letterSpacing: '-0.028em', color: INK }}>
        Offer one<br />resource.
      </h2>

      <div className="bft-in-2 mt-4 space-y-1.5">
        {resources.map((r) => (
          <button
            key={r.key}
            onClick={() => onPick(r)}
            className="w-full px-3 py-3 text-left transition-all active:scale-[0.99] flex items-center gap-3"
            style={{
              background: 'white',
              border: `1px solid ${INK}`,
            }}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-sm text-[12px] font-black"
              style={{ background: INK, color: PAPER }}
            >
              {r.n}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold" style={{ color: INK, letterSpacing: '0.04em' }}>{r.title}</p>
              <p className="text-[10.5px]" style={{ color: INK_2 }}>{r.sub}</p>
            </div>
            <span className="text-[14px] font-bold" style={{ color: INK_2 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function OutcomeBody({ route, onPick }) {
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: TEAL, letterSpacing: '0.22em' }}>
        Act IV · Log
      </p>
      <h2 className="bft-in-1 mt-2 text-[32px] font-semibold leading-[1.02]" style={{ letterSpacing: '-0.028em', color: INK }}>
        Did they<br />accept?
      </h2>

      <p className="bft-in-2 mt-3 text-[11px]" style={{ color: INK_2 }}>
        Resource offered: <span className="font-bold" style={{ color: INK }}>{route?.title}</span>
      </p>

      <div className="bft-in-3 mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onPick(true)}
          className="py-7 text-center transition-transform active:scale-[0.97]"
          style={{
            background: INK,
            color: PAPER,
            border: `1px solid ${INK}`,
          }}
        >
          <p className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.18em', opacity: 0.6 }}>YES</p>
          <p className="mt-2 text-[18px] font-bold uppercase" style={{ letterSpacing: '0.06em' }}>Accepted</p>
        </button>
        <button
          onClick={() => onPick(false)}
          className="py-7 text-center transition-transform active:scale-[0.97]"
          style={{
            background: 'transparent',
            color: INK,
            border: `1px solid ${INK}`,
          }}
        >
          <p className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.18em', color: INK_2 }}>NO</p>
          <p className="mt-2 text-[18px] font-bold uppercase" style={{ letterSpacing: '0.06em' }}>Declined</p>
        </button>
      </div>

      <p className="mt-3 text-center text-[9.5px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.12em' }}>
        · same record, either way ·
      </p>
    </div>
  );
}

function ValidatedBody({ elapsed, route, accepted, onReset }) {
  return (
    <div className="flex flex-col h-full">
      <p className="bft-in text-[9px] font-bold uppercase" style={{ color: STAMP_RED, letterSpacing: '0.22em' }}>
        Ledger · Sealed record
      </p>

      <div className="bft-in-1 mt-3 flex items-baseline gap-2">
        <span className="text-[56px] font-semibold leading-none tabular-nums" style={{ color: INK, letterSpacing: '-0.035em' }}>
          {elapsed.toFixed(1)}
        </span>
        <span className="text-[12px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.14em' }}>seconds total</span>
      </div>

      <div className="bft-in-2 mt-5 divide-y" style={{ borderColor: HAIR }}>
        <LedgerRow k="ROUTED TO" v={route?.title} />
        <LedgerRow k="RESOURCE" v={accepted ? 'ACCEPTED' : 'DECLINED'} />
        <LedgerRow k="HASH" v="0x7a3e…b91d" mono color={TEAL} />
        <LedgerRow k="NAMES SAVED" v="NONE" color={TEAL} />
        <LedgerRow k="EXPIRES" v="90 DAYS" color={TEAL} />
      </div>

      <div className="mt-auto pt-5">
        <button
          onClick={onReset}
          className="w-full rounded-sm py-[14px] text-[12px] font-bold uppercase transition-transform active:scale-[0.98]"
          style={{
            background: 'transparent',
            color: INK,
            border: `1px solid ${INK}`,
            letterSpacing: '0.16em',
          }}
        >
          Issue a new ticket
        </button>
        <p className="mt-3 text-center text-[9px] font-bold uppercase" style={{ color: INK_3, letterSpacing: '0.16em' }}>
          butterfly.one
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────── ATOMS ───────────────────────────

function LedgerRow({ k, v, mono, color = INK }) {
  return (
    <div
      className="flex items-baseline justify-between py-2"
      style={{ borderTop: k === 'ROUTED TO' ? `1px solid ${HAIR}` : 'none', borderBottom: `1px solid ${HAIR}` }}
    >
      <span className="text-[9px] font-bold uppercase" style={{ color: INK_2, letterSpacing: '0.14em' }}>{k}</span>
      <span
        className="text-[11.5px] font-bold"
        style={{
          color,
          fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'inherit',
          letterSpacing: '0.04em',
        }}
      >
        {v}
      </span>
    </div>
  );
}

function PerforationLine() {
  // Dotted horizontal line across the ticket
  return (
    <div className="relative h-[1px] mx-3">
      <div
        className="h-[1px] w-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${INK_2} 1px, transparent 1px)`,
          backgroundSize: '8px 2px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}

function ScallopEdge({ position, color }) {
  // Scalloped (wavy) edge on top or bottom of the ticket — paper feel
  const flip = position === 'top';
  return (
    <svg
      width="100%"
      height="8"
      viewBox="0 0 400 8"
      preserveAspectRatio="none"
      style={{
        display: 'block',
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <path
        d="M0 0 L0 4 Q 5 8 10 4 Q 15 0 20 4 Q 25 8 30 4 Q 35 0 40 4 Q 45 8 50 4 Q 55 0 60 4 Q 65 8 70 4 Q 75 0 80 4 Q 85 8 90 4 Q 95 0 100 4 Q 105 8 110 4 Q 115 0 120 4 Q 125 8 130 4 Q 135 0 140 4 Q 145 8 150 4 Q 155 0 160 4 Q 165 8 170 4 Q 175 0 180 4 Q 185 8 190 4 Q 195 0 200 4 Q 205 8 210 4 Q 215 0 220 4 Q 225 8 230 4 Q 235 0 240 4 Q 245 8 250 4 Q 255 0 260 4 Q 265 8 270 4 Q 275 0 280 4 Q 285 8 290 4 Q 295 0 300 4 Q 305 8 310 4 Q 315 0 320 4 Q 325 8 330 4 Q 335 0 340 4 Q 345 8 350 4 Q 355 0 360 4 Q 365 8 370 4 Q 375 0 380 4 Q 385 8 390 4 Q 395 0 400 4 L 400 0 Z"
        fill={color}
      />
    </svg>
  );
}
