export default function Home() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  const faqs = [
    {
      q: "How does the workload score work?",
      a: "Our AI scans each job description for signals like 'flexible hours', 'async-first', 'autonomous', and 'minimal meetings', then assigns a 1–10 score. Higher means less grind."
    },
    {
      q: "What kinds of jobs are listed?",
      a: "We focus on software engineering, design, and product roles at remote-friendly companies known for sustainable work cultures."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel with one click from your Lemon Squeezy billing portal. No questions asked, no hidden fees."
    }
  ];

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Nav */}
      <nav className="border-b border-[#30363d] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-[#58a6ff] font-bold text-lg tracking-tight">MinimalWork</span>
        <a
          href={checkoutUrl}
          className="bg-[#58a6ff] text-[#0d1117] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#79b8ff] transition-colors"
        >
          Get Access
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-xs font-medium px-3 py-1 rounded-full mb-6">
          AI-Powered Job Curation
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
          Tech Jobs That Won&apos;t{" "}
          <span className="text-[#58a6ff]">Burn You Out</span>
        </h1>
        <p className="text-[#8b949e] text-lg mb-10 max-w-xl mx-auto">
          We scrape thousands of job listings and use AI to score each one for workload intensity. Get a curated feed of roles with flexible hours, async culture, and minimal meetings — updated daily.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={checkoutUrl}
            className="bg-[#58a6ff] text-[#0d1117] font-bold px-8 py-3 rounded-md hover:bg-[#79b8ff] transition-colors text-base"
          >
            Start for $19/mo
          </a>
          <a
            href="#pricing"
            className="border border-[#30363d] text-[#c9d1d9] font-semibold px-8 py-3 rounded-md hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors text-base"
          >
            See What&apos;s Included
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#8b949e]">
          <span>✦ 2,400+ jobs scored weekly</span>
          <span>✦ Async-first filter</span>
          <span>✦ No-meeting culture badge</span>
          <span>✦ Remote-only toggle</span>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#161b22] border-y border-[#30363d] py-16">
        <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { step: "01", title: "We Scrape", desc: "Thousands of tech job boards aggregated daily into one place." },
            { step: "02", title: "AI Scores", desc: "GPT-4 reads each description and assigns a 1–10 workload score." },
            { step: "03", title: "You Filter", desc: "Browse only the jobs that match your ideal work-life balance." }
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <span className="text-[#58a6ff] text-xs font-bold tracking-widest">{step}</span>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-[#8b949e] text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-md mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-2">Simple Pricing</h2>
        <p className="text-[#8b949e] text-sm mb-10">One plan. Everything included. Cancel anytime.</p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-left relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#58a6ff] text-[#0d1117] text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-white">$19</span>
            <span className="text-[#8b949e] mb-1">/month</span>
          </div>
          <p className="text-[#8b949e] text-sm mb-6">Full access to the MinimalWork dashboard</p>
          <ul className="space-y-3 mb-8">
            {[
              "Daily-updated job feed",
              "AI workload score (1–10) per listing",
              "Async-first & no-meeting filters",
              "Remote-only toggle",
              "Email digest of top picks",
              "Cancel anytime"
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-[#c9d1d9]">
                <span className="text-[#58a6ff] font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href={checkoutUrl}
            className="block w-full bg-[#58a6ff] text-[#0d1117] font-bold py-3 rounded-md text-center hover:bg-[#79b8ff] transition-colors"
          >
            Get Access — $19/mo
          </a>
          <p className="text-center text-xs text-[#8b949e] mt-3">Secured by Lemon Squeezy</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-extrabold text-white text-center mb-10">FAQ</h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-[#30363d] rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">{q}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-8 text-center text-xs text-[#8b949e]">
        <p>© {new Date().getFullYear()} MinimalWork. Built for engineers who value their time.</p>
      </footer>
    </main>
  );
}
