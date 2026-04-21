"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { ArrowUpRight, Bookmark, BookmarkCheck, MapPin, Radar } from "lucide-react";

import { JobListing } from "@/lib/types";

interface JobCardProps {
  job: JobListing;
  isSaved: boolean;
  onToggleSave: (jobId: string) => Promise<void>;
}

function scoreClass(score: number): string {
  if (score >= 80) {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }
  if (score >= 62) {
    return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
  }
  if (score >= 45) {
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  }
  return "bg-rose-500/15 text-rose-300 border-rose-500/30";
}

export function JobCard({ job, isSaved, onToggleSave }: JobCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{job.company}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-100">{job.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span>
              Posted {formatDistanceToNowStrict(new Date(job.postedAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${scoreClass(job.workLife.score)}`}>
            <Radar className="mr-1 h-3 w-3" />
            {job.workLife.score}/100
          </span>
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            aria-label={isSaved ? "Remove saved job" : "Save job"}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{job.descriptionSnippet}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Positive Signals</p>
          <p className="mt-1 text-sm text-slate-300">
            {job.workLife.positiveSignals.length > 0
              ? job.workLife.positiveSignals.slice(0, 2).join(" • ")
              : "No explicit balance language found, but role avoided major pressure keywords."}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">Risk Signals</p>
          <p className="mt-1 text-sm text-slate-300">
            {job.workLife.riskSignals.length > 0
              ? job.workLife.riskSignals.slice(0, 2).join(" • ")
              : "No major burnout signals detected in public description."}
          </p>
        </div>
      </div>

      <a
        href={job.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/30"
      >
        Open original listing
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  );
}
