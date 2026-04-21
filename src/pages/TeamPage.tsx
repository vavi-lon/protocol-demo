import { Navbar, Footer, FadeIn, PartnerCTA } from '../components/shared';

const teams = [
  {
    function: "Celebrity + Distribution",
    members: [
      { name: "FAME (Sheeraz Hasan)", role: "Celebrity amplification, 25 years", tag: "" },
      { name: "Komi", role: "125,000 creators", tag: "CONFIRMED" },
      { name: "ITP Media", role: "Broadcast production", tag: "CONFIRMED" },
    ]
  },
  {
    function: "Product + Technology",
    members: [
      { name: "Ari Spool", role: "Head of Product. 10+ years (Snap, GIPHY, Know Your Meme).", tag: "" },
      { name: "Richard Jhang", role: "StratMinds — ex-IBM Chief Innovation Officer", tag: "" },
      { name: "Anton Borzov", role: "StratMinds — First Designer at WhatsApp. 1.8B users.", tag: "" },
      { name: "Summer Kim", role: "StratMinds — Global UX", tag: "" },
    ]
  },
  {
    function: "Clinical + Research",
    members: [
      { name: "Ricky Brar (Brains)", role: "Medical Ecosystem Lead", tag: "FOUNDING" },
      { name: "Cleveland Clinic pathway", role: "Advisory", tag: "" },
    ]
  },
  {
    function: "Finance + Institutional",
    members: [
      { name: "David Knower", role: "Cerberus", tag: "ADVISOR" },
      { name: "James Morgon", role: "Milken Institute", tag: "FOUNDING PARTNER" },
    ]
  },
  {
    function: "Gaming + Digital",
    members: [
      { name: "Sang Yoon Lee", role: "Creta", tag: "FOUNDING" },
      { name: "Thomas Vu", role: "Riot Games", tag: "ADVISOR" },
    ]
  },
  {
    function: "Culture + Events",
    members: [
      { name: "Andrew Dawson", role: "Music", tag: "ADVISOR" },
      { name: "Ralph Simon", role: "Telco + Music", tag: "ADVISOR" },
      { name: "Bernd Breiter", role: "World Club Dome — Festival culture", tag: "ADVISOR" },
    ]
  },
  {
    function: "Founding Partners",
    members: [
      { name: "Adel Ghazzawi", role: "", tag: "" },
      { name: "Kwon Hyuk", role: "Naver / Happy Bean", tag: "" },
      { name: "Afifi El Alami", role: "", tag: "" },
      { name: "Bruno Costa", role: "", tag: "" },
    ]
  },
  {
    function: "Foundation",
    members: [
      { name: "Evan Klassen", role: "Founder", tag: "" },
      { name: "One Humanity Foundation", role: "501(c)(3). 30+ advisors across 12 industries.", tag: "" },
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

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">THE COALITION</span>
              <h1 className="mb-6 text-white">Built by the coalition <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">that can launch it.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Organized by function, not biography. Confirmed names only.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="section bg-bg-muted/30">
          <div className="container">
            <div className="space-y-6">
              {teams.map((team, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="card card-hover p-8 md:p-10 border-hair">
                    <h3 className="text-accent font-bold uppercase tracking-widest text-[14px] mb-6">{team.function}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {team.members.map((member, j) => (
                        <div key={j} className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-ink font-bold text-[18px]">{member.name}</span>
                            {member.tag && (
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tagStyles(member.tag)}`}>
                                {member.tag}
                              </span>
                            )}
                          </div>
                          {member.role && <span className="text-muted text-[15px]">{member.role}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <FadeIn>
              <div className="card bg-bg-muted border-none p-6 md:p-12 text-center">
                <h2 className="mb-6 mx-auto">Governance</h2>
                <p className="text-[18px] font-medium mb-4 mx-auto">One Humanity Foundation · 501(c)(3) · Published governance · Independent board</p>
                <p className="mb-4 mx-auto">Developed with clinical advisors across: Psychiatry · Organizational Psychology · Emergency Medicine · Crisis Intervention</p>
                <p className="caption mx-auto">Reviewed against: OSHA · WHO mhGAP · SAMHSA · ISO 45003</p>
              </div>
            </FadeIn>
          </div>
        </section>

        <PartnerCTA
          headline="Join the founding coalition."
          buttonText="Join the founding coalition"
        />
      </main>
      <Footer />
    </div>
  );
}
