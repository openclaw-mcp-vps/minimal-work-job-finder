"use client";

export interface JobFilterState {
  query: string;
  role: string;
  remoteOnly: boolean;
  minScore: number;
  hideMixed: boolean;
}

interface JobFiltersProps {
  filters: JobFilterState;
  onChange: (next: JobFilterState) => void;
  disabled?: boolean;
}

export function JobFilters({ filters, onChange, disabled = false }: JobFiltersProps) {
  return (
    <section className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Keyword</span>
        <input
          type="text"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="TypeScript, design systems, platform"
          disabled={disabled}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Role Family</span>
        <input
          type="text"
          value={filters.role}
          onChange={(event) => onChange({ ...filters, role: event.target.value })}
          placeholder="Engineer, Product, Design"
          disabled={disabled}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Minimum Score</span>
        <input
          type="range"
          min={35}
          max={95}
          value={filters.minScore}
          onChange={(event) => onChange({ ...filters, minScore: Number(event.target.value) })}
          disabled={disabled}
          className="accent-cyan-400"
        />
        <span className="text-xs text-slate-300">{filters.minScore} / 100</span>
      </label>

      <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(event) => onChange({ ...filters, remoteOnly: event.target.checked })}
          disabled={disabled}
          className="h-4 w-4 accent-cyan-400"
        />
        Remote only
      </label>

      <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={filters.hideMixed}
          onChange={(event) => onChange({ ...filters, hideMixed: event.target.checked })}
          disabled={disabled}
          className="h-4 w-4 accent-cyan-400"
        />
        Hide mixed-culture roles
      </label>
    </section>
  );
}
