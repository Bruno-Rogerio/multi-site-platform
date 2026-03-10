"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock, CreditCard, CheckCircle2, Kanban, GripVertical } from "lucide-react";

export type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: string;
  created_at: string;
  ownerEmail: string | null;
  billingStatus: string | null;
  pipelineStatus: "draft" | "checkout_pending" | "active";
};

type PipelineColumn = {
  status: "draft" | "checkout_pending" | "active";
  label: string;
  icon: typeof Clock;
  color: string;
  borderColor: string;
  bgColor: string;
};

const COLUMNS: PipelineColumn[] = [
  {
    status: "draft",
    label: "Rascunho",
    icon: Clock,
    color: "text-amber-300",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-400/5",
  },
  {
    status: "checkout_pending",
    label: "Checkout pendente",
    icon: CreditCard,
    color: "text-blue-300",
    borderColor: "border-blue-400/20",
    bgColor: "bg-blue-400/5",
  },
  {
    status: "active",
    label: "Ativo",
    icon: CheckCircle2,
    color: "text-emerald-300",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
  },
];

const PLAN_LABELS: Record<string, string> = {
  pro: "Premium",
  landing: "Básico",
};

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "agora";
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "há 1 dia" : `há ${days} dias`;
}

// ── Draggable Card ────────────────────────────────────────────────────────────

function SiteCard({ site, isDragging = false }: { site: SiteRow; isDragging?: boolean }) {
  return (
    <article
      className={`rounded-lg border border-white/10 bg-[#0B1020] p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical size={14} className="mt-0.5 shrink-0 text-[var(--platform-text)]/20" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--platform-text)]">{site.name}</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-[#22D3EE]">{site.domain}</p>
          {site.ownerEmail && (
            <p className="mt-0.5 truncate text-[10px] text-[var(--platform-text)]/40">
              {site.ownerEmail}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[var(--platform-text)]/60">
              {PLAN_LABELS[site.plan] ?? site.plan}
            </span>
            <span className="text-[10px] text-[var(--platform-text)]/40">
              {formatRelative(site.created_at)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function DraggableSiteCard({ site }: { site: SiteRow }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: site.id,
    data: { pipelineStatus: site.pipelineStatus },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: isDragging ? 999 : undefined }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}
    >
      <SiteCard site={site} />
    </div>
  );
}

// ── Droppable Column ──────────────────────────────────────────────────────────

function DroppableColumn({
  column,
  items,
  isOver,
}: {
  column: PipelineColumn;
  items: SiteRow[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: column.status });
  const Icon = column.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border ${column.borderColor} bg-[#12182B] p-4 transition-colors ${isOver ? column.bgColor : ""}`}
      style={{ minHeight: 200 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon size={16} className={column.color} />
        <h3 className={`text-sm font-semibold ${column.color}`}>{column.label}</h3>
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-[var(--platform-text)]/60">
          {items.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-[var(--platform-text)]/30">Nenhum item</p>
        ) : (
          items.map((site) => <DraggableSiteCard key={site.id} site={site} />)
        )}
      </div>
    </div>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────

export function PipelineBoard({ sites: initialSites }: { sites: SiteRow[] }) {
  const [sites, setSites] = useState<SiteRow[]>(initialSites);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const activeSite = activeId ? sites.find((s) => s.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverColumn(null);

    if (!over) return;
    const newStatus = over.id as SiteRow["pipelineStatus"];
    const currentStatus = (
      active.data.current as { pipelineStatus: SiteRow["pipelineStatus"] } | undefined
    )?.pipelineStatus;
    if (!currentStatus || currentStatus === newStatus) return;

    const siteId = active.id as string;

    // Optimistic update
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, pipelineStatus: newStatus } : s)),
    );

    // Persist to DB
    await fetch(`/api/admin/pipeline/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {
      // Rollback on failure
      setSites((prev) =>
        prev.map((s) => (s.id === siteId ? { ...s, pipelineStatus: currentStatus } : s)),
      );
    });
  }

  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#12182B] p-12 text-center">
        <Kanban size={40} className="mx-auto text-[var(--platform-text)]/20" />
        <p className="mt-3 text-sm text-[var(--platform-text)]/50">
          Nenhum site cadastrado ainda.
        </p>
      </div>
    );
  }

  const grouped = COLUMNS.map((col) => ({
    column: col,
    items: sites.filter((s) => s.pipelineStatus === col.status),
  }));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={(e) => setOverColumn((e.over?.id as string) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        setOverColumn(null);
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {grouped.map(({ column, items }) => (
          <DroppableColumn
            key={column.status}
            column={column}
            items={items}
            isOver={overColumn === column.status}
          />
        ))}
      </div>

      <DragOverlay>
        {activeSite ? (
          <div className="rotate-1 opacity-90 shadow-2xl">
            <SiteCard site={activeSite} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
