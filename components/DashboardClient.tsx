"use client";

import Link from "next/link";
import { format } from "date-fns";

import { JobListing, SavedSearch } from "@/lib/types";

interface DashboardClientProps {
  email: string;
  initialSearches: SavedSearch[];
  initialSavedJobs: JobListing[];
}

export function DashboardClient({ email, initialSearches, initialSavedJobs }: DashboardClientProps) {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Signed in as</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-100">{email}</h1>
        <p className="mt-2 text-sm text-slate-300">Use this dashboard to reopen high-quality searches and continue applications without starting from scratch.</p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Saved searches</h2>
          <Link href="/jobs" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
            Open jobs explorer
          </Link>
        </div>

        {initialSearches.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">You have no saved searches yet. Save one from the jobs page.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {initialSearches.map((search) => {
              const params = new URLSearchParams({
                query: search.query,
                role: search.role,
                remoteOnly: String(search.remoteOnly),
                minScore: String(search.minScore)
              });

              return (
                <li key={search.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-100">{search.name}</p>
                    <Link href={`/jobs?${params.toString()}`} className="text-sm text-cyan-300 hover:text-cyan-200">
                      Reopen search
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Query: {search.query || "(none)"} • Role: {search.role || "all"} • Min score: {search.minScore}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Saved {format(new Date(search.createdAt), "MMM d, yyyy")}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Saved jobs</h2>

        {initialSavedJobs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No saved jobs yet. Bookmark interesting roles from the jobs explorer.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {initialSavedJobs.map((job) => (
              <li key={job.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-100">{job.title}</p>
                    <p className="text-sm text-slate-400">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <a href={job.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 hover:text-cyan-200">
                    Open listing
                  </a>
                </div>
                <p className="mt-2 text-sm text-slate-300">{job.descriptionSnippet}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
