import { Navbar, Footer, FadeIn, PartnerCTA, FileText } from '../components/shared';

/** v2: Confirmed coalition only */
const teams = [
  {
    function: "Celebrity + Distribution",
    members: [
      { name: "FAME (Sheeraz Hasan)", role: "Celebrity amplification, 25 years", tag: "CONFIRMED" },
      { name: "Komi", role: "125,000 creators", tag: "CONFIRMED" },
      { name: "ITP Media", role: "Broadcast production", tag: "CONFIRMED" },
    ]
  },
  {
    function: "Product",
    members: [
      { name: "Ari Spool", role: "Head of Product. 10+ years (Snap, GIPHY, Know Your Meme).", tag: "" },
    ]
  },
  {
    function: "Advisory",
    members: [
      { name: "StratMinds — Richard Jhang", role: "ex-IBM Chief Innovation Officer", tag: "" },
      { name: "StratMinds — Anton Borzov", role: "First Designer at WhatsApp. 1.8B users.", tag: "" },
      { name: "StratMinds — Summer Kim", role: "Global UX", tag: "" },
    ]
  },
  {
    function: "Foundation",
    members: [
      { name: "Evan Klassen", role: "Founder", tag: "" },
      { name: "Butterfly Foundation", role: "501(c)(3). 30+ advisors.", tag: "" },
    ]
  },
];

const tagStyles = (tag: string) => {
  if (!tag) return "";
  if (tag.includes("FOUNDING")) return "bg-accent text-white";
  if (tag === "ADVISOR") return "bg-bg-muted text-ink";
  if (tag === "CONFIRMED") return "bg-accent-light text-accent";
  return "bg-bg-muted text-ink";
};

/** Section 1 — Founder story */
const FounderStory = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-4 block">FOUNDER STORY</span>
        <h2 className="mb-10">Evan Klassen.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start">
        {/* Single photograph allowed on the site — placeholder circle in warm muted tone */}
        <FadeIn>
          <div className="w-full aspect-square rounded-[32px] bg-gradient-to-br from-bg-muted to-accent-light/40 border border-hair flex items-center justify-center">
            <span className="text-caption text-[12px] font-bold tracking-widest uppercase">Evan</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="space-y-5 text-ink">
            <p className="text-[20px] md:text-[22px] font-medium italic leading-snug text-ink">
              "The pandemic forced me to face something I'd been ignoring my whole life…"
            </p>
            <p className="text-[16px] text-muted leading-relaxed">
              The Butterfly Foundation began with a single recognition: mental health is the one topic nearly everyone has a story about — and almost no one has a protocol for. The Butterfly gesture, the Challenge, and the 30-second Protocol all grew from the same question: what if showing up were something anyone could learn in under a minute?
            </p>
            <p className="text-[16px] text-muted leading-relaxed">
              Butterfly Foundation is a 501(c)(3) organization. We build tools, standards, and campaigns that make visible care into shared infrastructure.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

/** Section 2 — Confirmed Coalition */
const ConfirmedCoalition = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">CONFIRMED COALITION</span>
        <h2 className="mb-12">Organized by function. Confirmed names only.</h2>
      </FadeIn>
      <div className="space-y-6">
        {teams.map((team, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="card card-hover p-8 md:p-10 border-hair">
              <h3 className="text-accent font-bold uppercase tracking-widest text-[14px] mb-6">{team.function}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.members.map((m, j) => (
                  <div key={j} className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-ink font-bold text-[18px]">{m.name}</span>
                      {m.tag && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tagStyles(m.tag)}`}>
                          {m.tag}
                        </span>
                      )}
                    </div>
                    {m.role && <span className="text-muted text-[15px]">{m.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/** Section 3 — Governance */
const GovernanceBlock = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-4 block">GOVERNANCE</span>
        <h2 className="mb-10">Built for the long game.</h2>
      </FadeIn>
      <div className="card border-hair p-8 md:p-10 mb-8">
        <ul className="space-y-4 text-[16px]">
          <li className="flex gap-3 text-ink"><span className="text-accent font-bold">/</span><span>Butterfly Foundation — 501(c)(3). Independent board.</span></li>
          <li className="flex gap-3 text-ink"><span className="text-accent font-bold">/</span><span>Clinical advisors across psychiatry, organizational psychology, emergency medicine, crisis intervention.</span></li>
          <li className="flex gap-3 text-ink"><span className="text-accent font-bold">/</span><span>Reviewed against OSHA · WHO mhGAP · SAMHSA · ISO 45003.</span></li>
          <li className="flex gap-3 text-ink"><span className="text-accent font-bold">/</span><span>Butterfly Constitution (OHF-BC-2026-001) governs every partnership.</span></li>
          <li className="flex gap-3 text-ink"><span className="text-accent font-bold">/</span><span>Non-political. Non-religious. Non-commercial in its soul.</span></li>
        </ul>
      </div>
      <a href="#" className="text-accent font-bold hover:underline inline-flex items-center gap-2 text-[16px]">
        <FileText size={18} /> Download the Butterfly Constitution
      </a>
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">ABOUT</span>
              <h1 className="mb-6 text-white">One foundation. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">A confirmed coalition.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                The founder, the team, the governance. Built to last beyond the launch.
              </p>
            </FadeIn>
          </div>
        </section>
        <FounderStory />
        <ConfirmedCoalition />
        <GovernanceBlock />
        <PartnerCTA
          headline="Partner with us."
          buttonText="Partner with us"
        />
      </main>
      <Footer />
    </div>
  );
}
