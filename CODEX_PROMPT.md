# Build Task: minimal-work-job-finder

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: minimal-work-job-finder
HEADLINE: Find tech jobs requiring minimal actual work
WHAT: None
WHY: None
WHO PAYS: None
NICHE: job-search
PRICE: $$19/mo

ARCHITECTURE SPEC:
A Next.js web app that scrapes and curates tech job listings, using AI to analyze job descriptions for workload indicators like 'flexible hours', 'autonomous work', 'minimal meetings'. Users get filtered job feeds and workload scores via a subscription dashboard.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/api/jobs/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- app/api/auth/[...nextauth]/route.ts
- components/JobCard.tsx
- components/WorkloadScore.tsx
- lib/job-scraper.ts
- lib/ai-analyzer.ts
- lib/lemonsqueezy.ts
- lib/auth.ts
- lib/db.ts

DEPENDENCIES: next, tailwindcss, next-auth, prisma, @prisma/client, openai, cheerio, axios, @lemonsqueezy/lemonsqueezy.js, stripe

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/minimal-work-job-finder
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d9501-1d74-7452-8299-a52173c4bf5b
--------
user
# Build Task: minimal-work-job-finder

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: minimal-work-job-finder
HEADLINE: Find tech 
Please fix the above errors and regenerate.