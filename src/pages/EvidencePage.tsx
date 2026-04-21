import {
  Navbar, Footer, FadeIn, PartnerCTA,
  Context, Evidence, ROICalculator
} from '../components/shared';

/** Section 1 — The scale: 6 data tiles per spec */
const TheScale = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">THE GAP</span>
        <h2 className="mb-12">The numbers behind the silence.</h2>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { stat: "970 million", desc: "People affected", source: "WHO, 2019" },
          { stat: "$5 trillion", desc: "Annual cost", source: "WHO Global Burden" },
          { stat: "11 years", desc: "Average wait for help", source: "Multiple studies" },
          { stat: "76%", desc: "Workers with symptoms", source: "Workplace surveys" },
          { stat: "48.6%", desc: "Didn't know where to get help", source: "SAMHSA NSDUH, 2023" },
          { stat: "67 days", desc: "Median wait for psychiatrist", source: "2023 National Audit" },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="card p-8 h-full border-hair">
              <div className="text-accent font-bold text-[36px] md:text-[40px] mb-4 leading-tight">{item.stat}</div>
              <p className="text-ink font-medium text-[16px] md:text-[18px] mb-2">{item.desc}</p>
              <p className="caption text-[13px]">{item.source}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <p className="text-[18px] md:text-[20px] text-ink font-medium italic max-w-[640px]">
        "The systems to help exist. The signal to reach them does not."
      </p>
    </div>
  </section>
);

/** Section 2 — The business case: 3 ROI cards before calculator */
const BusinessCase = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">THE ROI</span>
        <h2 className="mb-12">What this saves your organization.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { stat: "5:1", desc: "Return on workplace programs", detail: "£4.70 returned per £1 invested", source: "Deloitte UK, 2020" },
          { stat: "46%", desc: "Productivity loss from untreated conditions", detail: "Across major workforce studies", source: "WHO" },
          { stat: "$12,000", desc: "Annual cost per disengaged employee", detail: "Lost productivity + turnover impact", source: "Gallup / SHRM" },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card p-8 h-full border-hair">
              <div className="text-accent font-bold text-[40px] md:text-[48px] mb-3 leading-tight">{item.stat}</div>
              <p className="text-ink font-medium text-[18px] mb-3">{item.desc}</p>
              <p className="text-muted text-[14px] mb-3">{item.detail}</p>
              <p className="caption text-[13px]">{item.source}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <p className="caption text-[14px] max-w-[640px]">
        Average EAP: $30–100/employee/year at 2–8% utilization.
      </p>
    </div>
  </section>
);

/** Section 4 — Competitive Positioning: "The activation layer." */
const CompetitiveTable = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">NOT A REPLACEMENT</span>
        <h2 className="mb-12">The activation layer.</h2>
      </FadeIn>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-4 md:py-6 font-bold text-ink text-[14px] md:text-[16px] pr-4 md:pr-8">Program</th>
              <th className="py-4 md:py-6 font-bold text-ink text-[14px] md:text-[16px] pr-4 md:pr-8">Time</th>
              <th className="py-4 md:py-6 font-bold text-ink text-[14px] md:text-[16px]">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hair">
            <tr className="hover:bg-bg-muted transition-colors">
              <td className="py-4 md:py-8 text-ink pr-4 md:pr-8 text-[15px] md:text-[18px]">Mental Health First Aid</td>
              <td className="py-4 md:py-8 text-muted pr-4 md:pr-8 text-[14px] md:text-[16px]">8 hours</td>
              <td className="py-4 md:py-8 text-muted text-[14px] md:text-[16px]">Knowledge certification</td>
            </tr>
            <tr className="hover:bg-bg-muted transition-colors">
              <td className="py-4 md:py-8 text-ink pr-4 md:pr-8 text-[15px] md:text-[18px]">QPR</td>
              <td className="py-4 md:py-8 text-muted pr-4 md:pr-8 text-[14px] md:text-[16px]">1 hour</td>
              <td className="py-4 md:py-8 text-muted text-[14px] md:text-[16px]">Gatekeeper training</td>
            </tr>
            <tr className="hover:bg-bg-muted transition-colors">
              <td className="py-4 md:py-8 text-ink pr-4 md:pr-8 text-[15px] md:text-[18px]">safeTALK</td>
              <td className="py-4 md:py-8 text-muted pr-4 md:pr-8 text-[14px] md:text-[16px]">3 hours</td>
              <td className="py-4 md:py-8 text-muted text-[14px] md:text-[16px]">Awareness training</td>
            </tr>
            <tr className="bg-accent/5 border-l-4 border-accent">
              <td className="py-4 md:py-8 pl-4 pr-4 md:pr-8 text-[15px] md:text-[18px]">
                <span className="font-bold text-ink">Butterfly Protocol</span>
              </td>
              <td className="py-4 md:py-8 pr-4 md:pr-8 text-[14px] md:text-[16px]">
                <span className="font-bold text-accent text-[16px] md:text-[20px]">30 seconds</span>
              </td>
              <td className="py-4 md:py-8 text-[14px] md:text-[16px]">
                <span className="font-bold text-accent">Activation layer</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">THE EVIDENCE</span>
              <h1 className="mb-6 text-white">Everything a Brand VP needs to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">verify the claims.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Data. Science. Business case. Every claim is sourced. Every number is cited.
              </p>
            </FadeIn>
          </div>
        </section>
        <TheScale />
        <BusinessCase />
        <Context />
        <ROICalculator />
        <Evidence />
        <CompetitiveTable />
        <PartnerCTA
          headline="The numbers make the case. The protocol makes it real."
          buttonText="Request Partnership Brief"
        />
      </main>
      <Footer />
    </div>
  );
}
