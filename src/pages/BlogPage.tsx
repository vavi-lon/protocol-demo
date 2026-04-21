import { Navbar, Footer, FadeIn } from '../components/shared';

const posts = [
  {
    category: "Science",
    title: "Why the butterfly hug works: the neuroscience",
    excerpt: "Bilateral self-soothing, prefrontal regulation, and what 30 years of trauma research reveals about the gesture.",
    date: "April 12, 2026",
  },
  {
    category: "Movement",
    title: "How May became the most important month in mental health",
    excerpt: "From Mental Health Awareness Month to Butterfly Month — the arc of a global activation anchored by one gesture.",
    date: "April 8, 2026",
  },
  {
    category: "Partnership",
    title: "Introducing the Butterfly Protocol for teams",
    excerpt: "A 30-second check-in that HR directors, GC, and EAP leads can deploy in 90 days. Here's what it looks like at scale.",
    date: "April 2, 2026",
  },
];

const categoryStyles = (cat: string) => {
  if (cat === "Science") return "bg-accent-light text-accent";
  if (cat === "Movement") return "bg-accent text-white";
  if (cat === "Partnership") return "bg-bg-muted text-ink";
  return "bg-bg-muted text-ink";
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">BLOG</span>
              <h1 className="mb-6 text-white">News, stories, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">and resources.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Research. Field notes. Movement updates. From the Butterfly Foundation.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((p, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <article className="card card-hover p-8 h-full flex flex-col border-hair">
                    <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-6 ${categoryStyles(p.category)}`}>
                      {p.category}
                    </span>
                    <h2 className="text-ink font-bold text-[22px] md:text-[24px] mb-4 leading-tight">{p.title}</h2>
                    <p className="text-muted text-[15px] leading-relaxed mb-6 flex-grow">{p.excerpt}</p>
                    <p className="caption text-[13px]">{p.date}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
            <p className="caption text-center mt-12 text-[13px]">Full publication coming post-launch.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
