import {
  Navbar, Footer, FadeIn, PartnerCTA, Link,
  Category, Comparison, Legal, Training,
  Organizations, Check, ProtocolStepper
} from '../components/shared';

/** v2: Bridge line at top of page */
const BridgeLine = () => (
  <section className="section bg-white pt-12 pb-0 border-none">
    <div className="container max-w-[800px]">
      <FadeIn>
        <p className="text-[18px] md:text-[20px] text-ink font-medium leading-relaxed">
          The Butterfly Challenge teaches the world the sign. This page shows organizations what to do when they see it.
        </p>
        <a href="https://butterflychallenge.com" className="text-accent font-bold hover:underline inline-flex items-center gap-1 mt-3 text-[15px]">
          See the Challenge → butterflychallenge.com
        </a>
      </FadeIn>
    </div>
  </section>
);

/** Section 5 — Compliance detail */
const ComplianceDetail = () => (
  <section className="section bg-bg-muted/30">
    <div className="container max-w-[800px]">
      <FadeIn>
        <span className="overline mb-4 block">COMPLIANCE</span>
        <h2 className="mb-12">Built for legal review.</h2>
      </FadeIn>
      <div className="card border-hair p-8 md:p-10">
        <ul className="space-y-4">
          {[
            { title: "EEOC", desc: "Non-diagnostic, voluntary." },
            { title: "RE-AIM", desc: "Standardized evaluation framework." },
            { title: "Anti-washing clause", desc: "No reputational cover without genuine deployment." },
            { title: "No personal health data", desc: "Behavioral records, separately stored, 90-day retention." },
            { title: "DPIA-ready", desc: "Data Protection Impact Assessment template included for EU operations." },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-ink text-[16px]">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span><span className="font-bold">{item.title}:</span> <span className="text-muted">{item.desc}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/** v2: Deploy in Your Organization section (bottom) */
const DeployInYourOrganization = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">DEPLOY IN YOUR ORGANIZATION</span>
        <h2 className="mb-12">Four contexts. One protocol.</h2>
      </FadeIn>
      <Organizations />
      <div className="max-w-[800px] mx-auto mt-16 mb-8">
        <FadeIn>
          <h3 className="text-[22px] font-bold mb-6">90-day rollout</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { phase: "Phase 1", range: "Days 1–30", title: "Foundation", items: ["Designate protocol lead", "Customize script", "Configure routing"] },
              { phase: "Phase 2", range: "Days 31–60", title: "Training", items: ["Manager training (10 min/person)", "Materials distribution", "Data governance setup"] },
              { phase: "Phase 3", range: "Days 61–90", title: "Activation", items: ["Go-live", "First RE-AIM measurement", "Feedback + refinement"] }
            ].map((p, i) => (
              <div key={i} className="card card-hover p-6 border-hair">
                <span className="text-accent font-bold uppercase tracking-widest text-[12px] block">{p.phase}</span>
                <span className="caption text-[11px] block mb-3">{p.range}</span>
                <h4 className="font-bold text-ink text-[18px] mb-3">{p.title}</h4>
                <ul className="space-y-1.5">
                  {p.items.map((it, j) => (
                    <li key={j} className="flex gap-2 text-muted text-[14px]">
                      <span className="text-accent font-bold">•</span><span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
      <div className="text-center mt-12">
        <Link to="/partner" className="btn-primary px-8 py-4 text-[16px]">Request Deployment Brief</Link>
      </div>
    </div>
  </section>
);

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">THE PROTOCOL</span>
              <h1 className="mb-6 text-white">Four steps. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">Thirty seconds.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                You are the first responder, not the therapist. See. Stay. Ask. Connect.
              </p>
            </FadeIn>
          </div>
        </section>
        <BridgeLine />
        <Category />
        <ProtocolStepper />
        {/* <ProtocolDemos /> — V4/V5/V6 hidden, only V1 used */}
        <Comparison />
        <Legal />
        <Training />
        <ComplianceDetail />
        <DeployInYourOrganization />
        <PartnerCTA
          headline="Deploy in your organization."
          buttonText="Request Deployment Brief"
        />
      </main>
      <Footer />
    </div>
  );
}
