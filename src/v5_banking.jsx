import { useState, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────
// BUTTERFLY — V5 BANKING
// Inspired by Image 3 (Salung banking app).
// Deep black dark-card as the hero object. Rounded pill progress bars.
// Spacious white resource cards with colored category marks.
// Floating black bottom nav/CTA.
// Fintech confidence applied to a mental-health product.
// ────────────────────────────────────────────────────────────────────

const TEAL = '#0A4AD6';
const MINT = '#7BA7F5';
const INK = '#0A0A0C';
const INK_2 = '#6E6E73';
const INK_3 = '#A1A1A6';
const HAIR = '#ECECEF';
const SURFACE = '#F3F3F5';
const BG = '#F7F7F8';

const Mark = ({ size = 18, color = TEAL }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

export default function ButterflyBanking() {
  const [phase, setPhase] = useState('home');
  // home → approach → listen → route → outcome → sealed
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
  const reset = () => { setPhase('home'); setStartedAt(null); setElapsed(0); setRoute(null); setAccepted(null); };

  const stepIdx = { home: 0, approach: 1, listen: 2, route: 3, outcome: 4, sealed: 5 }[phase];

  return (
    <div
      className="min-h-screen w-full flex items-stretch justify-center"
      style={{
        background: '#E6E6E9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
        color: INK,
      }}
    >
      <style>{`
        @keyframes bfb-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bfb-shine { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes bfb-bar-grow { from { width: 0; } }
        @keyframes bfb-pulse-dot { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .bfb-in { animation: bfb-in 500ms cubic-bezier(0.16,1,0.3,1) both; }
        .bfb-in-1 { animation: bfb-in 500ms cubic-bezier(0.16,1,0.3,1) 80ms both; }
        .bfb-in-2 { animation: bfb-in 500ms cubic-bezier(0.16,1,0.3,1) 160ms both; }
        .bfb-in-3 { animation: bfb-in 500ms cubic-bezier(0.16,1,0.3,1) 240ms both; }
      `}</style>

      <div className="relative flex w-full max-w-[430px] flex-col overflow-hidden" style={{ background: BG, minHeight: '100vh' }}>
        {/* Top header — like a banking app greeting */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <div>
            <p className="text-[13px]" style={{ color: INK_2 }}>
              {phase === 'home' ? 'Welcome,' : 'Protocol in progress'}
            </p>
            <p className="text-[22px] font-semibold leading-tight" style={{ color: INK, letterSpacing: '-0.02em' }}>
              {phase === 'home' ? 'Sarah' : `Step ${Math.max(stepIdx, 1)} of 4`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'white', border: `1px solid ${HAIR}` }}
            >
              <Mark size={14} color={INK} />
            </div>
          </div>
        </div>

        {/* Body — scrolls if needed but designed to fit */}
        <div key={phase} className="flex flex-1 flex-col px-5 pb-[110px]">
          {phase === 'home' && <HomeView onBegin={begin} />}
          {phase === 'approach' && <ApproachView onNext={() => setPhase('listen')} elapsed={elapsed} stepIdx={stepIdx} />}
          {phase === 'listen' && <ListenView onNext={() => setPhase('route')} elapsed={elapsed} stepIdx={stepIdx} />}
          {phase === 'route' && <RouteView onPick={(r) => { setRoute(r); setPhase('outcome'); }} elapsed={elapsed} stepIdx={stepIdx} />}
          {phase === 'outcome' && <OutcomeView route={route} onPick={(a) => { setAccepted(a); setElapsed((Date.now() - startedAt) / 1000); setPhase('sealed'); }} elapsed={elapsed} stepIdx={stepIdx} />}
          {phase === 'sealed' && <SealedView elapsed={elapsed} route={route} accepted={accepted} onReset={reset} />}
        </div>

        {/* Floating bottom bar — big black pill like banking apps */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(247,247,248,1) 60%, transparent)' }}>
          <div className="pointer-events-auto">
            {phase === 'home' && (
              <BottomAction onClick={begin} label="Start check-in" icon="+" primary />
            )}
            {phase === 'sealed' && (
              <BottomAction onClick={reset} label="Run it again" icon="↻" primary />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── VIEWS ───────────────────────────

function HomeView({ onBegin }) {
  return (
    <>
      {/* HERO: the dark card — banking style */}
      <div
        className="bfb-in relative overflow-hidden rounded-[24px] px-5 py-5 mb-5"
        style={{
          background: `linear-gradient(145deg, #18181B, #0A0A0C)`,
          boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle ornament — like the subtle arcs in the Salung card */}
        <svg className="absolute right-[-40px] top-[-40px] opacity-20" width="180" height="180" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="80" stroke={TEAL} strokeWidth="0.5" />
          <circle cx="90" cy="90" r="50" stroke={TEAL} strokeWidth="0.5" />
          <circle cx="90" cy="90" r="20" stroke={TEAL} strokeWidth="0.5" />
        </svg>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-full px-2 py-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: MINT, animation: 'bfb-pulse-dot 1.6s infinite' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>LIVE</span>
          </div>
          <span className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>
            Your Team · 12
          </span>
        </div>

        <p className="mt-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Protocol readiness</p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[40px] font-semibold leading-none tabular-nums" style={{ color: 'white', letterSpacing: '-0.035em' }}>
            100
          </span>
          <span className="text-[18px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>%</span>
          <span
            className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: `${MINT}25`, color: MINT }}
          >
            trained
          </span>
        </div>

        {/* Quick stats row */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[
            { label: 'Check-ins', v: '47', icon: '↗' },
            { label: 'Accepted', v: '38', icon: '✓' },
            { label: 'Quarter', v: 'Q2', icon: '📅' },
            { label: 'Audit', v: 'OK', icon: '🔒' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-[12px]" style={{ color: 'white' }}>{s.icon}</span>
              </div>
              <p className="text-[9.5px]" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's care section */}
      <div className="bfb-in-1 flex items-center justify-between mb-3 px-1">
        <p className="text-[15px] font-semibold" style={{ color: INK, letterSpacing: '-0.01em' }}>Today's care</p>
        <p className="text-[12px]" style={{ color: INK_2 }}>View all ›</p>
      </div>

      {/* Scenario card — styled like a goal card */}
      <div
        className="bfb-in-2 rounded-2xl px-4 py-4 mb-3"
        style={{ background: 'white', border: `1px solid ${HAIR}` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${TEAL}15` }}>
            <Mark size={16} color={TEAL} />
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-semibold" style={{ color: INK, letterSpacing: '-0.005em' }}>Jamie · been quiet this week</p>
            <p className="text-[11.5px]" style={{ color: INK_2 }}>Missed 2 standups · Slack status off 3d</p>
          </div>
          <span className="text-[18px]" style={{ color: INK_3 }}>›</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold" style={{ color: INK }}>Worth a check-in</span>
            <span className="text-[11px] tabular-nums font-semibold" style={{ color: TEAL }}>30s</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE }}>
            <div className="h-full rounded-full" style={{ width: '78%', background: `linear-gradient(90deg, ${TEAL}, ${MINT})` }} />
          </div>
        </div>
      </div>

      <div
        className="bfb-in-3 rounded-2xl px-4 py-4"
        style={{ background: 'white', border: `1px solid ${HAIR}` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: '#FEF3E4' }}>
            <span style={{ color: '#E8A34F' }}>✻</span>
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-semibold" style={{ color: INK, letterSpacing: '-0.005em' }}>Q2 compliance report</p>
            <p className="text-[11.5px]" style={{ color: INK_2 }}>Auto-generates in 12 days · OSHA</p>
          </div>
          <span className="text-[18px]" style={{ color: INK_3 }}>›</span>
        </div>
      </div>
    </>
  );
}

// Pill progress — banking style, horizontal bar with filled segment
function PillProgress({ step }) {
  const pct = (step / 4) * 100;
  return (
    <div className="rounded-full p-1 flex items-center gap-1" style={{ background: SURFACE }}>
      <div className="flex-1 h-8 rounded-full relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-700 flex items-center justify-center"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${TEAL}, ${MINT})`,
            boxShadow: `0 2px 8px -2px ${TEAL}88`,
          }}
        >
          <span className="text-[10.5px] font-bold text-white" style={{ letterSpacing: '0.04em' }}>
            STEP {step}/4
          </span>
        </div>
      </div>
    </div>
  );
}

// Shared protocol header: pill progress + timer card
function ProtocolHeader({ elapsed, stepIdx }) {
  return (
    <>
      {/* Timer card — dark, the "balance" */}
      <div
        className="bfb-in relative overflow-hidden rounded-[20px] px-5 py-4 mb-4"
        style={{ background: `linear-gradient(145deg, #18181B, #0A0A0C)` }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>
            Live · Check-in
          </p>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: MINT, animation: 'bfb-pulse-dot 1.4s infinite' }} />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[40px] font-semibold leading-none tabular-nums" style={{ color: 'white', letterSpacing: '-0.035em' }}>
            {elapsed.toFixed(1)}
          </span>
          <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>seconds elapsed</span>
        </div>
      </div>

      <div className="bfb-in-1 mb-5">
        <PillProgress step={stepIdx} />
      </div>
    </>
  );
}

function ApproachView({ onNext, elapsed, stepIdx }) {
  return (
    <>
      <ProtocolHeader elapsed={elapsed} stepIdx={stepIdx} />
      <p className="bfb-in-2 text-[10.5px] font-semibold uppercase mb-2" style={{ color: TEAL, letterSpacing: '0.16em' }}>
        Step 1 · Approach
      </p>
      <h2 className="bfb-in-2 text-[28px] font-semibold leading-[1.1] mb-4" style={{ letterSpacing: '-0.024em' }}>
        Name what you saw.
      </h2>

      <div className="bfb-in-3 rounded-2xl p-4" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
        <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: INK_2, letterSpacing: '0.12em' }}>Try saying</p>
        <p className="text-[16px] leading-[1.35] font-medium" style={{ color: INK, letterSpacing: '-0.005em' }}>
          "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?"
        </p>
      </div>

      <div className="bfb-in-3 mt-auto pt-6">
        <BottomAction onClick={onNext} label="I said it" primary />
      </div>
    </>
  );
}

function ListenView({ onNext, elapsed, stepIdx }) {
  const rules = [
    { t: 'Let them talk', s: 'Silence is fine too' },
    { t: 'No advice', s: 'No "have you tried..."' },
    { t: 'Stay curious', s: "You're the router" },
  ];
  return (
    <>
      <ProtocolHeader elapsed={elapsed} stepIdx={stepIdx} />
      <p className="bfb-in-2 text-[10.5px] font-semibold uppercase mb-2" style={{ color: TEAL, letterSpacing: '0.16em' }}>
        Step 2 · Listen
      </p>
      <h2 className="bfb-in-2 text-[28px] font-semibold leading-[1.1] mb-4" style={{ letterSpacing: '-0.024em' }}>
        Don't fix.<br />Don't diagnose.
      </h2>

      <div className="bfb-in-3 space-y-2">
        {rules.map((r, i) => (
          <div key={r.t} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${TEAL}12` }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke={TEAL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold" style={{ color: INK }}>{r.t}</p>
              <p className="text-[11.5px]" style={{ color: INK_2 }}>{r.s}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <BottomAction onClick={onNext} label="I listened" primary />
      </div>
    </>
  );
}

function RouteView({ onPick, elapsed, stepIdx }) {
  const resources = [
    { key: '988', title: '988 Lifeline', sub: '24/7 crisis · free', short: '988', tone: { bg: '#FEE4E4', fg: '#E55' }, icon: '☎' },
    { key: 'eap', title: 'Lyra Health', sub: 'EAP · confidential therapy', short: 'Lyra', tone: { bg: '#E4F1FE', fg: '#3A7EC8' }, icon: '◐' },
    { key: 'kim', title: 'Dr. Kim', sub: 'On-site · Wed & Fri', short: 'Dr. Kim', tone: { bg: `${TEAL}20`, fg: TEAL }, icon: '◆' },
  ];
  return (
    <>
      <ProtocolHeader elapsed={elapsed} stepIdx={stepIdx} />
      <p className="bfb-in-2 text-[10.5px] font-semibold uppercase mb-2" style={{ color: TEAL, letterSpacing: '0.16em' }}>
        Step 3 · Route
      </p>
      <h2 className="bfb-in-2 text-[28px] font-semibold leading-[1.1] mb-4" style={{ letterSpacing: '-0.024em' }}>
        Offer one resource.
      </h2>

      <div className="bfb-in-3 space-y-2">
        {resources.map((r) => (
          <button
            key={r.key}
            onClick={() => onPick(r)}
            className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.99]"
            style={{ background: 'white', border: `1px solid ${HAIR}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[18px]"
                style={{ background: r.tone.bg, color: r.tone.fg }}
              >
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold" style={{ color: INK, letterSpacing: '-0.005em' }}>{r.title}</p>
                <p className="text-[11.5px]" style={{ color: INK_2 }}>{r.sub}</p>
              </div>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold"
                style={{ background: INK, color: 'white' }}
              >
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function OutcomeView({ route, onPick, elapsed, stepIdx }) {
  return (
    <>
      <ProtocolHeader elapsed={elapsed} stepIdx={stepIdx} />
      <p className="bfb-in-2 text-[10.5px] font-semibold uppercase mb-2" style={{ color: TEAL, letterSpacing: '0.16em' }}>
        Step 4 · Log
      </p>
      <h2 className="bfb-in-2 text-[28px] font-semibold leading-[1.1] mb-2" style={{ letterSpacing: '-0.024em' }}>
        Did they accept?
      </h2>
      <p className="bfb-in-2 text-[13px] mb-4" style={{ color: INK_2 }}>
        Offered <span className="font-semibold" style={{ color: INK }}>{route?.title}</span>
      </p>

      <div className="bfb-in-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => onPick(true)}
          className="rounded-2xl p-5 text-left transition-transform active:scale-[0.97]"
          style={{ background: `linear-gradient(145deg, ${TEAL}, #008F70)`, color: 'white', boxShadow: `0 12px 24px -12px ${TEAL}` }}
        >
          <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: '0.12em', opacity: 0.7 }}>YES</span>
          <p className="mt-8 text-[22px] font-semibold leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>Accepted</p>
        </button>
        <button
          onClick={() => onPick(false)}
          className="rounded-2xl p-5 text-left transition-transform active:scale-[0.97]"
          style={{ background: 'white', color: INK, border: `1px solid ${HAIR}` }}
        >
          <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: '0.12em', color: INK_2 }}>NO</span>
          <p className="mt-8 text-[22px] font-semibold leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>Declined</p>
        </button>
      </div>

      <p className="bfb-in-3 mt-4 text-[11.5px] text-center" style={{ color: INK_3 }}>
        Both answers log the same. No performance implications.
      </p>
    </>
  );
}

function SealedView({ elapsed, route, accepted, onReset }) {
  return (
    <>
      {/* Dark success "balance" card */}
      <div
        className="bfb-in relative overflow-hidden rounded-[24px] px-5 py-6 mb-5"
        style={{
          background: `linear-gradient(145deg, ${TEAL}, #007A62)`,
          boxShadow: `0 20px 40px -20px ${TEAL}80`,
        }}
      >
        <svg className="absolute right-[-50px] top-[-30px] opacity-30" width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="0.5" />
        </svg>

        <div className="flex items-center gap-1.5 rounded-full px-2 py-1 w-fit" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold uppercase" style={{ color: 'white', letterSpacing: '0.05em' }}>SEALED</span>
        </div>

        <p className="mt-3 text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Check-in completed in</p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[52px] font-semibold leading-none tabular-nums" style={{ color: 'white', letterSpacing: '-0.035em' }}>
            {elapsed.toFixed(1)}
          </span>
          <span className="text-[20px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>seconds</span>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Routed · {route?.short}
          </span>
          <span className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            {accepted ? 'Accepted' : 'Declined'}
          </span>
        </div>
      </div>

      {/* Receipt card */}
      <div className="bfb-in-1 flex items-center justify-between mb-3 px-1">
        <p className="text-[15px] font-semibold" style={{ color: INK, letterSpacing: '-0.01em' }}>What got saved</p>
      </div>

      <div className="bfb-in-2 rounded-2xl p-4 space-y-2.5" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
        <Row k="Event" v="Check-in completed" />
        <Row k="Routed to" v={route?.title} />
        <Row k="Resource" v={accepted ? 'Accepted' : 'Declined'} />
        <Row k="Hash" v="0x7a3e…b91d" mono color={TEAL} />

        <div className="pt-3 border-t space-y-1.5" style={{ borderColor: HAIR }}>
          <Fact>No name recorded</Fact>
          <Fact>Auto-purges in 90 days</Fact>
          <Fact>OSHA · ADA · HIPAA aligned</Fact>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────── ATOMS ───────────────────────────

function BottomAction({ onClick, label, icon, primary }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-full py-[17px] text-[15px] font-semibold transition-transform active:scale-[0.98]"
      style={{
        background: primary ? INK : 'white',
        color: primary ? 'white' : INK,
        letterSpacing: '-0.005em',
        boxShadow: primary ? '0 8px 20px -8px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {icon && <span className="text-[17px]">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

function Row({ k, v, mono, color = INK }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12px]" style={{ color: INK_2 }}>{k}</span>
      <span
        className="text-[13px] font-semibold"
        style={{
          color,
          fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'inherit',
        }}
      >
        {v}
      </span>
    </div>
  );
}

function Fact({ children }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke={TEAL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[12px]" style={{ color: INK_2 }}>{children}</span>
    </div>
  );
}
