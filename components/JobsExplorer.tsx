"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { JobCard } from "@/components/JobCard";
import { JobFilters, JobFilterState } from "@/components/JobFilters";
import { JobListing } from "@/lib/types";

const DEFAULT_FILTERS: JobFilterState = {
  query: "",
  role: "",
  remoteOnly: true,
  minScore: 62,
  hideMixed: true
};

export function JobsExplorer() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_FILTERS);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSearchFeedback, setSaveSearchFeedback] = useState<string>("");

  useEffect(() => {
    const hasParams =
      searchParams.has("query") || searchParams.has("role") || searchParams.has("minScore") || searchParams.has("remoteOnly");

    if (!hasParams) {
      return;
    }

    setFilters((current) => ({
      ...current,
      query: searchParams.get("query") ?? current.query,
      role: searchParams.get("role") ?? current.role,
      remoteOnly: searchParams.get("remoteOnly") ? searchParams.get("remoteOnly") === "true" : current.remoteOnly,
      minScore: searchParams.get("minScore") ? Number(searchParams.get("minScore")) || current.minScore : current.minScore
    }));
  }, [searchParams]);

  const fetchSavedJobs = useCallback(async () => {
    const response = await fetch("/api/saved-jobs", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { savedJobIds: string[] };
    setSavedJobIds(payload.savedJobIds ?? []);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      query: filters.query,
      role: filters.role,
      remoteOnly: String(filters.remoteOnly),
      minScore: String(filters.minScore),
      hideMixed: String(filters.hideMixed)
    });

    try {
      const response = await fetch(`/api/jobs?${params.toString()}`, { cache: "no-store" });
      const payload = (await response.json()) as { jobs?: JobListing[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load jobs");
      }

      setJobs(payload.jobs ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSavedJobs().catch(() => {
      return;
    });
  }, [fetchSavedJobs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs().catch(() => {
        return;
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [fetchJobs]);

  const onToggleSave = useCallback(async (jobId: string) => {
    const response = await fetch("/api/saved-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jobId })
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { savedJobIds: string[] };
    setSavedJobIds(payload.savedJobIds ?? []);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/scrape", { method: "POST" });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Refresh failed");
      }
      await fetchJobs();
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }, [fetchJobs]);

  const onSaveCurrentSearch = useCallback(async () => {
    const derivedName =
      filters.query.trim() || filters.role.trim()
        ? `Focus: ${filters.query || filters.role}`
        : `Balanced roles (${filters.minScore}+)`;

    const response = await fetch("/api/saved-searches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: derivedName,
        query: filters.query,
        role: filters.role,
        remoteOnly: filters.remoteOnly,
        minScore: filters.minScore
      })
    });

    if (response.ok) {
      setSaveSearchFeedback("Saved to dashboard.");
    } else {
      setSaveSearchFeedback("Could not save this search.");
    }

    setTimeout(() => setSaveSearchFeedback(""), 1800);
  }, [filters]);

  const savedJobIdSet = useMemo(() => new Set(savedJobIds), [savedJobIds]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div>
          <p className="text-sm text-slate-300">Ranked by sustainable workload score and filtered for practical work-life boundaries.</p>
          <p className="mt-1 text-xs text-slate-500">{jobs.length} matches</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveCurrentSearch}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Save this search
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh listings"}
          </button>
        </div>
      </div>

      {saveSearchFeedback ? <p className="text-sm text-emerald-300">{saveSearchFeedback}</p> : null}

      <JobFilters filters={filters} onChange={setFilters} disabled={loading || refreshing} />

      {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}

      {loading ? <p className="text-sm text-slate-400">Loading curated roles...</p> : null}

      {!loading && jobs.length === 0 ? (
        <p className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-300">
          No listings match this filter yet. Lower the score threshold or broaden the keyword.
        </p>
      ) : null}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} isSaved={savedJobIdSet.has(job.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
    </section>
  );
}
