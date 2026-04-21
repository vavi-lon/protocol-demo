import { useState, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────
// BUTTERFLY — V4 THE OBJECT
// Inspired by the "You're almost there" / "Nearly done" cards.
// A single floating card sits on a surface with ambient top-right light.
// The card MUTATES through the protocol — same object, different content.
// No navigation. No screens. Just a thing you hold and change.
// ────────────────────────────────────────────────────────────────────

const TEAL = '#0A4AD6';
const MINT = '#7BA7F5';
const INK = '#0A0A0C';
const INK_2 = '#6E6E73';
const INK_3 = '#A1A1A6';
const HAIR = '#E8E8EC';
const SURFACE = '#F5F5F7';
const WALL = '#F1EFEC';   // warm wall color — where the light lands
const WALL_2 = '#D8D5CF'; // where the light doesn't

const Mark = ({ size = 16, color = TEAL }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

const STEPS = [
  { n: 1, label: 'Approach' },
  { n: 2, label: 'Listen' },
  { n: 3, label: 'Route' },
  { n: 4, label: 'Log' },
];

export default function ButterflyObject() {
  const [phase, setPhase] = useState('idle');
  // idle → approach → listen → route → outcome → sealed
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [route, setRoute] = useState(null);
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    if (startedAt === null || phase === 'sealed') return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => clearInterval(id);
  }, [startedAt, phase]);

  const begin = () => { setStartedAt(Date.now()); setPhase('approach'); };
  const reset = () => { setPhase('idle'); setStartedAt(null); setElapsed(0); setRoute(null); setAccepted(null); };

  const stepIndex = { idle: 0, approach: 1, listen: 2, route: 3, outcome: 4, sealed: 5 }[phase];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        // Ambient directional light — upper-right brighter, lower-left darker
        background: `
          radial-gradient(circle at 85% 0%, rgba(255,255,255,0.9), transparent 55%),
          radial-gradient(circle at 10% 100%, ${WALL_2}, transparent 60%),
          linear-gradient(135deg, ${WALL} 0%, ${WALL_2} 100%)
        `,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
        color: INK,
        padding: '24px',
      }}
    >
      <style>{`
        @keyframes bfo-content-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bfo-draw { to { stroke-dashoffset: 0; } }
        @keyframes bfo-card-hover { 0%, 100% { transform: translateY(0) rotate(-0.2deg); } 50% { transform: translateY(-3px) rotate(0.1deg); } }
        @keyframes bfo-stamp { 0% { opacity: 0; transform: translate(-50%, -50%) scale(1.8) rotate(-18deg); } 70% { opacity: 1; transform: translate(-50%, -50%) scale(0.94) rotate(-12deg); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-12deg); } }
        @keyframes bfo-light-sweep { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.75; } }
        .bfo-content { animation: bfo-content-in 400ms cubic-bezier(0.16,1,0.3,1) both; }
        .bfo-content-1 { animation: bfo-content-in 400ms cubic-bezier(0.16,1,0.3,1) 60ms both; }
        .bfo-content-2 { animation: bfo-content-in 400ms cubic-bezier(0.16,1,0.3,1) 120ms both; }
        .bfo-content-3 { animation: bfo-content-in 400ms cubic-bezier(0.16,1,0.3,1) 180ms both; }
        .bfo-card { animation: bfo-card-hover 6s ease-in-out infinite; }
      `}</style>

      {/* Top context line — this is ALL that lives outside the card */}
      <div className="flex items-center gap-2 mb-10 opacity-60">
        <Mark size={14} color={INK} />
        <span className="text-[11px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.18em' }}>
          Butterfly Protocol
        </span>
      </div>

      {/* THE OBJECT — the entire demo lives in this one card */}
      <div className="relative" style={{ maxWidth: '420px', width: '100%' }}>
        {/* Hard drop shadow beneath the card — like a real object on a surface */}
        <div
          className="absolute inset-x-6 -bottom-2 h-12 blur-2xl"
          style={{ background: 'rgba(0,0,0,0.25)', transform: 'translateY(12px)', borderRadius: '100%' }}
        />
        <div
          className="absolute inset-x-12 -bottom-4 h-6 blur-xl"
          style={{ background: 'rgba(0,0,0,0.15)', transform: 'translateY(8px)', borderRadius: '100%' }}
        />

        {/* The card itself */}
        <div
          className="relative rounded-[28px] overflow-hidden bfo-card"
          style={{
            background: '#FCFCFB',
            // Inner glow from the upper-right, matching the ambient light
            boxShadow: `
              0 2px 1px rgba(255,255,255,0.9) inset,
              0 -1px 1px rgba(0,0,0,0.04) inset,
              0 40px 80px -20px rgba(20, 20, 30, 0.25),
              0 20px 40px -15px rgba(20, 20, 30, 0.15)
            `,
          }}
        >
          {/* Specular highlight — light from upper-right */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.8), transparent 40%)',
              animation: 'bfo-light-sweep 8s ease-in-out infinite',
            }}
          />

          {/* Top chrome — timer + step marker, tiny */}
          <div className="relative flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: phase === 'sealed' ? TEAL : (startedAt ? TEAL : INK_3), animation: startedAt && phase !== 'sealed' ? 'bfo-light-sweep 1.4s ease-in-out infinite' : 'none' }} />
              <span className="text-[10px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.14em' }}>
                {phase === 'idle' ? 'Ready' : phase === 'sealed' ? 'Sealed' : 'Live'}
              </span>
            </div>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: startedAt ? (phase === 'sealed' ? TEAL : INK) : INK_3, fontFeatureSettings: '"tnum"' }}>
              {startedAt ? `${elapsed.toFixed(1)}s` : '0.0s'}
            </span>
          </div>

          {/* Content region — morphs per phase */}
          <div key={phase} className="relative px-7 pb-6 min-h-[340px] flex flex-col">
            {phase === 'idle' && <IdleContent onBegin={begin} />}
            {phase === 'approach' && <ApproachContent onNext={() => setPhase('listen')} />}
            {phase === 'listen' && <ListenContent onNext={() => setPhase('route')} />}
            {phase === 'route' && <RouteContent onPick={(r) => { setRoute(r); setPhase('outcome'); }} />}
            {phase === 'outcome' && <OutcomeContent route={route} onPick={(a) => { setAccepted(a); setElapsed((Date.now() - startedAt) / 1000); setPhase('sealed'); }} />}
            {phase === 'sealed' && <SealedContent elapsed={elapsed} route={route} accepted={accepted} onReset={reset} />}
          </div>

          {/* Step rail — pill progress at bottom, always present except idle & sealed */}
          {phase !== 'idle' && phase !== 'sealed' && (
            <div className="relative px-7 pb-5">
              <StepRail active={stepIndex} />
            </div>
          )}

          {/* Hint bar — floating pill just above the bottom, contextual */}
          {phase !== 'idle' && phase !== 'sealed' && (
            <div className="relative flex justify-center pb-5">
              <HintPill phase={phase} />
            </div>
          )}

          {/* SEALED stamp — on top of everything */}
          {phase === 'sealed' && (
            <div
              className="pointer-events-none absolute"
              style={{
                top: '35%',
                right: '14%',
                animation: 'bfo-stamp 700ms cubic-bezier(0.3,1.4,0.4,1) 200ms both',
                transformOrigin: 'center',
              }}
            >
              <div
                className="rounded-md border-[2.5px] px-3.5 py-2 text-[14px] font-black uppercase"
                style={{ borderColor: TEAL, color: TEAL, letterSpacing: '0.14em' }}
              >
                Sealed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom context line */}
      <div className="mt-10 text-center">
        <p className="text-[11px]" style={{ color: INK_2, letterSpacing: '0.02em' }}>
          {phase === 'idle' && 'Tap Begin to run the protocol.'}
          {phase !== 'idle' && phase !== 'sealed' && 'Tap to advance the card.'}
          {phase === 'sealed' && 'butterfly.one'}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────── CONTENTS ───────────────────────────

function IdleContent({ onBegin }) {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center pt-2">
        <h1 className="bfo-content text-[32px] font-semibold leading-[1.08]" style={{ letterSpacing: '-0.026em', color: INK }}>
          One check-in.
          <br />
          <span style={{ color: INK_3 }}>Built in 30 seconds.</span>
        </h1>

        <div className="bfo-content-1 mt-6 flex flex-wrap gap-2">
          <Chip>4 steps</Chip>
          <Chip>Zero PII</Chip>
          <Chip>Audit-ready</Chip>
        </div>
      </div>

      <button
        onClick={onBegin}
        className="bfo-content-2 w-full rounded-full py-[17px] text-[15px] font-semibold transition-transform active:scale-[0.98]"
        style={{ background: INK, color: 'white', letterSpacing: '-0.005em', boxShadow: '0 8px 20px -8px rgba(0,0,0,0.4)' }}
      >
        Begin the protocol
      </button>
    </>
  );
}

function ApproachContent({ onNext }) {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <p className="bfo-content text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.16em' }}>
          Step 1 · Approach
        </p>
        <h2 className="bfo-content-1 mt-2 text-[26px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.022em' }}>
          Name what you saw.
        </h2>

        <div
          className="bfo-content-2 mt-5 rounded-2xl p-4"
          style={{ background: SURFACE, border: `1px solid ${HAIR}` }}
        >
          <p className="text-[10px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.12em' }}>Try saying</p>
          <p className="mt-2 text-[15px] leading-[1.4] font-medium" style={{ color: INK }}>
            "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?"
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="bfo-content-3 w-full rounded-full py-[15px] text-[14px] font-semibold transition-transform active:scale-[0.98] mt-4"
        style={{ background: TEAL, color: 'white', letterSpacing: '-0.005em', boxShadow: `0 6px 14px -6px ${TEAL}` }}
      >
        I said it
      </button>
    </>
  );
}

function ListenContent({ onNext }) {
  const rules = ['Let them talk', 'No advice', 'Silence is OK'];
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <p className="bfo-content text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.16em' }}>
          Step 2 · Listen
        </p>
        <h2 className="bfo-content-1 mt-2 text-[26px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.022em' }}>
          Don't fix. Don't<br />diagnose.
        </h2>

        <div className="bfo-content-2 mt-5 grid grid-cols-3 gap-2">
          {rules.map((r) => (
            <div key={r} className="rounded-xl p-3 text-center" style={{ background: SURFACE, border: `1px solid ${HAIR}` }}>
              <p className="text-[11.5px] font-medium" style={{ color: INK, letterSpacing: '-0.005em' }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="bfo-content-3 w-full rounded-full py-[15px] text-[14px] font-semibold transition-transform active:scale-[0.98] mt-4"
        style={{ background: TEAL, color: 'white', letterSpacing: '-0.005em', boxShadow: `0 6px 14px -6px ${TEAL}` }}
      >
        I listened
      </button>
    </>
  );
}

function RouteContent({ onPick }) {
  const resources = [
    { key: '988', title: '988 Lifeline', sub: '24/7 crisis', short: '988' },
    { key: 'eap', title: 'Lyra Health', sub: 'Free EAP therapy', short: 'Lyra Health' },
    { key: 'kim', title: 'Dr. Kim', sub: 'On-site · Wed/Fri', short: 'Dr. Kim' },
  ];
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <p className="bfo-content text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.16em' }}>
          Step 3 · Route
        </p>
        <h2 className="bfo-content-1 mt-2 text-[26px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.022em' }}>
          Offer one resource.
        </h2>

        <div className="bfo-content-2 mt-5 space-y-2">
          {resources.map((r) => (
            <button
              key={r.key}
              onClick={() => onPick(r)}
              className="w-full rounded-xl p-3 text-left transition-all active:scale-[0.99] flex items-center justify-between"
              style={{ background: SURFACE, border: `1px solid ${HAIR}` }}
            >
              <div>
                <p className="text-[14px] font-semibold" style={{ color: INK }}>{r.title}</p>
                <p className="text-[11.5px]" style={{ color: INK_2 }}>{r.sub}</p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: TEAL, color: 'white' }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function OutcomeContent({ route, onPick }) {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <p className="bfo-content text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.16em' }}>
          Step 4 · Log
        </p>
        <h2 className="bfo-content-1 mt-2 text-[26px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.022em' }}>
          Did they accept<br />{route?.short}?
        </h2>

        <div className="bfo-content-2 mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => onPick(true)}
            className="rounded-2xl py-5 text-[15px] font-semibold transition-transform active:scale-[0.97]"
            style={{ background: TEAL, color: 'white', boxShadow: `0 8px 18px -8px ${TEAL}` }}
          >
            Accepted
          </button>
          <button
            onClick={() => onPick(false)}
            className="rounded-2xl py-5 text-[15px] font-semibold transition-transform active:scale-[0.97]"
            style={{ background: 'white', color: INK, border: `1px solid ${HAIR}` }}
          >
            Declined
          </button>
        </div>
      </div>
    </>
  );
}

function SealedContent({ elapsed, route, accepted, onReset }) {
  return (
    <>
      <div className="flex-1 flex flex-col pt-4">
        <p className="bfo-content text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.16em' }}>
          Check-in sealed
        </p>
        <div className="bfo-content-1 mt-2 flex items-baseline gap-2">
          <span className="text-[54px] font-semibold leading-none tabular-nums" style={{ color: INK, letterSpacing: '-0.035em' }}>
            {elapsed.toFixed(1)}
          </span>
          <span className="text-[18px] font-medium" style={{ color: INK_2 }}>seconds</span>
        </div>

        <div className="bfo-content-2 mt-5 grid grid-cols-2 gap-2">
          <Fact k="Routed" v={route?.short || '—'} />
          <Fact k="Outcome" v={accepted ? 'Accepted' : 'Declined'} />
          <Fact k="Name saved" v="None" pos />
          <Fact k="Expires" v="90 days" pos />
        </div>

        <div className="bfo-content-3 mt-4 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: SURFACE }}>
          <span className="text-[10px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.1em' }}>Compliant</span>
          <span className="text-[10.5px] font-semibold" style={{ color: INK }}>OSHA · ADA · HIPAA</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="bfo-content-3 w-full rounded-full py-[15px] text-[14px] font-semibold transition-transform active:scale-[0.98] mt-4"
        style={{ background: SURFACE, color: INK, letterSpacing: '-0.005em' }}
      >
        Run it again
      </button>
    </>
  );
}

// ─────────────────────────── UI ATOMS ───────────────────────────

function StepRail({ active }) {
  // Rounded inflated pill-style rail with filled checks
  return (
    <div
      className="flex items-center gap-1 rounded-full p-1"
      style={{ background: SURFACE, border: `1px solid ${HAIR}` }}
    >
      {STEPS.map((s, i) => {
        const done = i < active - 1;
        const current = i === active - 1;
        return (
          <div
            key={s.n}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 transition-all duration-500"
            style={{
              background: done || current
                ? `linear-gradient(135deg, ${TEAL}, ${MINT})`
                : 'transparent',
              boxShadow: current ? `0 2px 8px -2px ${TEAL}80` : 'none',
            }}
          >
            {done && (
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {current && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
            <span
              className="text-[10px] font-semibold uppercase"
              style={{
                color: done || current ? 'white' : INK_3,
                letterSpacing: '0.06em',
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HintPill({ phase }) {
  const hints = {
    approach: 'Specificity beats sympathy.',
    listen: "You're the router, not the therapist.",
    route: 'Pre-configured by HR. You just tap.',
    outcome: 'Both answers log the same. No judgment.',
  };
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{ background: 'white', border: `1px solid ${HAIR}`, boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)' }}
    >
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-black" style={{ background: TEAL, color: 'white' }}>i</span>
      <span className="text-[11px]" style={{ color: INK_2, letterSpacing: '-0.005em' }}>{hints[phase]}</span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span
      className="rounded-full px-3 py-1.5 text-[11px] font-medium"
      style={{ background: SURFACE, color: INK_2, border: `1px solid ${HAIR}`, letterSpacing: '-0.005em' }}
    >
      {children}
    </span>
  );
}

function Fact({ k, v, pos = false }) {
  return (
    <div className="rounded-xl p-3" style={{ background: SURFACE }}>
      <p className="text-[9.5px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.1em' }}>{k}</p>
      <p className="mt-0.5 text-[13px] font-semibold" style={{ color: pos ? TEAL : INK, letterSpacing: '-0.005em' }}>{v}</p>
    </div>
  );
}
