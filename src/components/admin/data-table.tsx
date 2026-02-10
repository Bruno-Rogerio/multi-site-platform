"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
};

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Buscar...",
  searchFilter,
  emptyIcon,
  emptyMessage = "Nenhum resultado encontrado.",
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = searchFilter && search
    ? data.filter((row) => searchFilter(row, search.toLowerCase()))
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      {/* Search */}
      {searchFilter && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--platform-text)]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-white/10 bg-[#0B1020] py-2.5 pl-10 pr-4 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/30 outline-none transition focus:border-[#22D3EE]/50"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#12182B]">
        {/* Header */}
        <div className="hidden border-b border-white/10 bg-[#0B1020]/50 md:grid" style={{ gridTemplateColumns: columns.map(() => "1fr").join(" ") }}>
          {columns.map((col) => (
            <div
              key={col.key}
              className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--platform-text)]/50 ${col.className ?? ""}`}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div className="py-12 text-center">
            {emptyIcon && <div className="mx-auto mb-3">{emptyIcon}</div>}
            <p className="text-sm text-[var(--platform-text)]/40">{emptyMessage}</p>
          </div>
        ) : (
          paginated.map((row) => (
            <div
              key={keyExtractor(row)}
              className="grid border-b border-white/5 transition hover:bg-white/[0.02] md:grid-cols-none"
              style={{ gridTemplateColumns: columns.map(() => "1fr").join(" ") }}
            >
              {columns.map((col) => (
                <div key={col.key} className={`px-4 py-3 text-sm text-[var(--platform-text)] ${col.className ?? ""}`}>
                  {/* Mobile label */}
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--platform-text)]/40 md:hidden">
                    {col.label}:{" "}
                  </span>
                  {col.render(row)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[var(--platform-text)]/50">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                  page === i
                    ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                    : "text-[var(--platform-text)]/50 hover:bg-white/[0.04]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
