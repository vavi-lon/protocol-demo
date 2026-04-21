import { Navbar, Footer, FadeIn, PartnerCTA } from '../components/shared';

/** Section 1 — The 84-hour choreography */
const Choreography = () => {
  const steps = [
    { time: "Hour 0", title: "Miami. April 30. F1 Weekend.", desc: "10 founding faces film it. FAME orchestrates.", accent: true },
    { time: "Hour 12", title: "\"What's that gesture?\"", desc: "Curiosity peaks. Searches spike. Traffic floods the site." },
    { time: "Hour 24", title: "Second wave", desc: "Unexpected faces. Athletes. Fighters. The embarrassment wall breaks." },
    { time: "Hour 48", title: "Chain multiplies", desc: "Gesture becomes self-explanatory. Nobody needs to be told." },
    { time: "Week 1", title: "It gets personal", desc: "Someone posts it for their mom. She watches it 14 times. Sends it to her sister. The gesture stops being a challenge. Starts being a language." },
  ];

  return (
    <section className="section bg-ink/[0.03]">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">THE 84-HOUR CHOREOGRAPHY</span>
          <h2 className="mb-12">This is how 10 videos become 10 million.</h2>
        </FadeIn>
        <div className="max-w-[800px] space-y-px bg-hair border border-hair rounded-3xl overflow-hidden">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={`bg-white p-8 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-bg-muted transition-colors ${step.accent ? 'border-l-4 border-accent' : ''}`}>
                <span className="w-24 shrink-0 font-bold text-accent uppercase tracking-widest text-[14px]">{step.time}</span>
                <div>
                  <h4 className="font-bold text-ink mb-2 text-[18px]">{step.title}</h4>
                  <p className="text-muted">{step.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Section 2 — The distribution engine */
const DistributionEngine = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">THE DISTRIBUTION ENGINE</span>
        <h2 className="mb-12">Three forces behind the launch.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            name: "FAME (Sheeraz Hasan)",
            lead: "Celebrity amplification · 25 years",
            desc: "Portfolio: Kardashian, Zendaya, Gomez, Bieber, Lopez, Chopra. Full team deployed.",
            note: "FAME's track record — the agency building this. Not listed as Butterfly commitments.",
            tag: "AMPLIFICATION"
          },
          {
            name: "Komi",
            lead: "125,000 creators · Celebrity access platform",
            desc: "Distribution for launch wave.",
            note: "CONFIRMED.",
            tag: "CREATORS"
          },
          {
            name: "ITP Media",
            lead: "Broadcast production · Global distribution",
            desc: "Middle East, Asia, Europe.",
            note: "CONFIRMED.",
            tag: "BROADCAST"
          },
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card card-hover p-8 h-full flex flex-col border-hair hover:shadow-lg transition-all">
              <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-4">{card.tag}</span>
              <h3 className="text-ink font-bold text-[22px] mb-2">{card.name}</h3>
              <p className="text-accent font-bold text-[14px] mb-4">{card.lead}</p>
              <p className="text-muted text-[16px] mb-4 flex-grow">{card.desc}</p>
              <p className="caption text-[13px] italic">{card.note}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/** Section 3 — The precedent */
const ALSPrecedent = () => (
  <section className="section bg-ink text-white">
    <div className="container text-center max-w-[800px]">
      <FadeIn>
        <span className="overline text-white/70 mb-4 block">THE PRECEDENT</span>
        <h2 className="text-white mb-12">One challenge proved a gesture can change a disease.</h2>
        <p className="text-white/70 mb-8 text-[18px] uppercase tracking-widest font-bold">ALS Ice Bucket Challenge</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 mb-12">
          {[
            { stat: "17M", label: "videos" },
            { stat: "$220M", label: "raised" },
            { stat: "159", label: "countries" },
            { stat: "5", label: "genes discovered" },
            { stat: "2", label: "FDA treatments approved" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-accent font-bold text-[32px] md:text-[40px]">{item.stat}</div>
              <div className="text-white/60 text-[14px] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-white/80 text-[20px] font-medium italic">
          "Same mechanic. Ours adds a permanent response system."
        </p>
      </FadeIn>
    </div>
  </section>
);

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">THE LAUNCH</span>
              <h1 className="mb-6 text-white">This is how 10 videos <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">become 10 million.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                The 84-hour choreography, the distribution engine, and the precedent.
              </p>
            </FadeIn>
          </div>
        </section>
        <Choreography />
        <DistributionEngine />
        <ALSPrecedent />
        <PartnerCTA
          headline="Partner with the launch."
          buttonText="Partner with the launch"
        />
      </main>
      <Footer />
    </div>
  );
}
