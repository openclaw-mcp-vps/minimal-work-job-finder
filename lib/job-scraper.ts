import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import axios from "axios";
import * as cheerio from "cheerio";

import { scoreJobWorkLife } from "@/lib/work-life-scorer";
import { JobListing } from "@/lib/types";

interface CompanySource {
  company: string;
  endpoint: string;
  source: "greenhouse" | "lever";
  baseline: number;
}

interface CachedPayload {
  refreshedAt: string;
  jobs: JobListing[];
}

const CACHE_PATH = path.join(process.cwd(), "data", "jobs-cache.json");
const CACHE_MAX_AGE_MS = 1000 * 60 * 45;

const SOURCES: CompanySource[] = [
  {
    company: "Doist",
    endpoint: "https://boards-api.greenhouse.io/v1/boards/doist/jobs?content=true",
    source: "greenhouse",
    baseline: 86
  },
  {
    company: "Zapier",
    endpoint: "https://boards-api.greenhouse.io/v1/boards/zapier/jobs?content=true",
    source: "greenhouse",
    baseline: 79
  },
  {
    company: "Mozilla",
    endpoint: "https://boards-api.greenhouse.io/v1/boards/mozilla/jobs?content=true",
    source: "greenhouse",
    baseline: 75
  },
  {
    company: "InVision",
    endpoint: "https://api.lever.co/v0/postings/invisionapp?mode=json",
    source: "lever",
    baseline: 74
  },
  {
    company: "HashiCorp",
    endpoint: "https://boards-api.greenhouse.io/v1/boards/hashicorp/jobs?content=true",
    source: "greenhouse",
    baseline: 69
  },
  {
    company: "1Password",
    endpoint: "https://boards-api.greenhouse.io/v1/boards/agilebits/jobs?content=true",
    source: "greenhouse",
    baseline: 77
  }
];

const CURATED_FALLBACKS: Omit<JobListing, "workLife">[] = [
  {
    id: "fallback-doist-senior-fullstack",
    title: "Senior Fullstack Engineer",
    company: "Doist",
    location: "Remote",
    remote: true,
    url: "https://doist.com/careers",
    postedAt: new Date().toISOString(),
    descriptionSnippet:
      "Build product features with an async-first team that emphasizes sustainable weekly workloads and deep-focus time.",
    source: "curated"
  },
  {
    id: "fallback-1password-product-designer",
    title: "Senior Product Designer",
    company: "1Password",
    location: "Remote (US/Canada)",
    remote: true,
    url: "https://1password.com/jobs",
    postedAt: new Date().toISOString(),
    descriptionSnippet:
      "Own end-to-end product design with strong collaboration rituals, low meeting overhead, and healthy execution pace.",
    source: "curated"
  },
  {
    id: "fallback-mozilla-senior-pm",
    title: "Senior Product Manager",
    company: "Mozilla",
    location: "Remote",
    remote: true,
    url: "https://careers.mozilla.org",
    postedAt: new Date().toISOString(),
    descriptionSnippet:
      "Lead product direction in a mission-driven organization known for thoughtful planning, flexible schedules, and humane expectations.",
    source: "curated"
  }
];

function snippetFromHtml(value: string | undefined): string {
  if (!value) {
    return "Role details are available on the company careers page.";
  }

  const $ = cheerio.load(value);
  const text = $.text().replace(/\s+/g, " ").trim();
  return text.slice(0, 340);
}

function parseGreenhouseJobs(company: CompanySource, payload: unknown): Omit<JobListing, "workLife">[] {
  const jobs = Array.isArray((payload as { jobs?: unknown[] }).jobs) ? (payload as { jobs: unknown[] }).jobs : [];

  return jobs
    .map((job) => {
      const entry = job as {
        id?: number;
        title?: string;
        absolute_url?: string;
        updated_at?: string;
        content?: string;
        location?: { name?: string };
      };

      if (!entry.id || !entry.title || !entry.absolute_url) {
        return null;
      }

      const location = entry.location?.name?.trim() || "Location not listed";
      const remote = /remote|anywhere|distributed/i.test(location);

      return {
        id: `${company.company.toLowerCase().replace(/\s+/g, "-")}-${entry.id}`,
        title: entry.title.trim(),
        company: company.company,
        location,
        remote,
        url: entry.absolute_url,
        postedAt: entry.updated_at ?? new Date().toISOString(),
        descriptionSnippet: snippetFromHtml(entry.content),
        source: company.source
      } as Omit<JobListing, "workLife">;
    })
    .filter((job): job is Omit<JobListing, "workLife"> => job !== null);
}

function parseLeverJobs(company: CompanySource, payload: unknown): Omit<JobListing, "workLife">[] {
  const jobs = Array.isArray(payload) ? payload : [];

  return jobs
    .map((job) => {
      const entry = job as {
        id?: string;
        text?: string;
        hostedUrl?: string;
        categories?: { location?: string };
        description?: string;
        descriptionPlain?: string;
        createdAt?: number;
      };

      if (!entry.id || !entry.text || !entry.hostedUrl) {
        return null;
      }

      const location = entry.categories?.location?.trim() || "Location not listed";
      const remote = /remote|anywhere|distributed/i.test(location);
      const description = entry.descriptionPlain ?? entry.description ?? "";

      return {
        id: `${company.company.toLowerCase().replace(/\s+/g, "-")}-${entry.id}`,
        title: entry.text.trim(),
        company: company.company,
        location,
        remote,
        url: entry.hostedUrl,
        postedAt: entry.createdAt ? new Date(entry.createdAt).toISOString() : new Date().toISOString(),
        descriptionSnippet: snippetFromHtml(description),
        source: company.source
      } as Omit<JobListing, "workLife">;
    })
    .filter((job): job is Omit<JobListing, "workLife"> => job !== null);
}

async function scrapeCompany(company: CompanySource): Promise<Omit<JobListing, "workLife">[]> {
  const response = await axios.get(company.endpoint, {
    timeout: 10_000,
    headers: {
      "User-Agent": "minimal-work-job-finder/1.0"
    }
  });

  if (company.source === "greenhouse") {
    return parseGreenhouseJobs(company, response.data);
  }

  return parseLeverJobs(company, response.data);
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const payload = await fs.readFile(CACHE_PATH, "utf8");
    const parsed = JSON.parse(payload) as CachedPayload;

    if (!Array.isArray(parsed.jobs) || typeof parsed.refreshedAt !== "string") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function writeCache(payload: CachedPayload): Promise<void> {
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const tempPath = `${CACHE_PATH}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tempPath, CACHE_PATH);
}

function withScores(entries: Omit<JobListing, "workLife">[], companyBaselines: Map<string, number>): JobListing[] {
  return entries
    .map((entry) => {
      const baseline = companyBaselines.get(entry.company) ?? 60;
      return {
        ...entry,
        workLife: scoreJobWorkLife(entry, baseline)
      };
    })
    .sort((a, b) => {
      if (b.workLife.score !== a.workLife.score) {
        return b.workLife.score - a.workLife.score;
      }
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
}

function dedupeJobs(jobs: Omit<JobListing, "workLife">[]): Omit<JobListing, "workLife">[] {
  const seen = new Set<string>();
  const unique: Omit<JobListing, "workLife">[] = [];

  for (const job of jobs) {
    if (seen.has(job.url)) {
      continue;
    }
    seen.add(job.url);
    unique.push(job);
  }

  return unique;
}

async function scrapeFreshJobs(): Promise<JobListing[]> {
  const jobs = await Promise.all(
    SOURCES.map(async (company) => {
      try {
        return await scrapeCompany(company);
      } catch {
        return [];
      }
    })
  );

  const flattened = dedupeJobs(jobs.flat());
  const fallbacks = flattened.length > 0 ? flattened : CURATED_FALLBACKS;
  const baselines = new Map(SOURCES.map((source) => [source.company, source.baseline]));

  return withScores(fallbacks, baselines);
}

export async function getCuratedJobs(options?: {
  forceRefresh?: boolean;
  includeExcluded?: boolean;
}): Promise<{ jobs: JobListing[]; refreshedAt: string; source: "cache" | "fresh" }> {
  const includeExcluded = options?.includeExcluded ?? false;

  if (!options?.forceRefresh) {
    const cached = await readCache();
    if (cached) {
      const age = Date.now() - new Date(cached.refreshedAt).getTime();
      if (age < CACHE_MAX_AGE_MS) {
        return {
          jobs: includeExcluded ? cached.jobs : cached.jobs.filter((job) => !job.workLife.shouldExclude),
          refreshedAt: cached.refreshedAt,
          source: "cache"
        };
      }
    }
  }

  const jobs = await scrapeFreshJobs();
  const refreshedAt = new Date().toISOString();
  const payload: CachedPayload = { jobs, refreshedAt };
  await writeCache(payload);

  return {
    jobs: includeExcluded ? jobs : jobs.filter((job) => !job.workLife.shouldExclude),
    refreshedAt,
    source: "fresh"
  };
}
