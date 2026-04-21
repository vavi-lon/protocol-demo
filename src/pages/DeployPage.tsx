import {
  Navbar, Footer, FadeIn, PartnerCTA,
  Organizations, DeployTimeline, Measurement
} from '../components/shared';

/** Q1-Q4 Validation Timeline — Change 7 */
const ValidationTimeline = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">VALIDATION TIMELINE (YEAR 1)</span>
        <h2 className="mb-12">From foundation to scale.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            quarter: "Q1",
            title: "Foundation",
            items: ["Advisory board", "Safety Standard v1.0", "First 3 pilots"]
          },
          {
            quarter: "Q2",
            title: "Validation",
            items: ["3–5 pilots (200–2,000 employees)", "RE-AIM measurement"]
          },
          {
            quarter: "Q3",
            title: "Ignition",
            items: ["Founding assembly", "Global cascade", "Announce results"]
          },
          {
            quarter: "Q4",
            title: "Scale",
            items: ["Broad rollout", "Publish data", "Certification program"]
          },
        ].map((q, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card card-hover p-8 h-full flex flex-col border-hair">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-accent font-bold text-[28px]">{q.quarter}</span>
                <span className="text-ink font-bold text-[18px]">{q.title}</span>
              </div>
              <ul className="space-y-3 flex-grow">
                {q.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-muted text-[15px]">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">DEPLOY</span>
              <h1 className="mb-6 text-white">Deploy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">90 days.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Three phases. Designate. Train. Activate. Built for enterprises ready to implement.
              </p>
            </FadeIn>
          </div>
        </section>
        <Organizations />
        <DeployTimeline />
        <ValidationTimeline />
        <Measurement />
        <PartnerCTA
          headline="Ready to deploy?"
          buttonText="Request a deployment brief"
        />
      </main>
      <Footer />
    </div>
  );
}
