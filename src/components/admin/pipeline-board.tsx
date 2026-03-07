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

export type DraftRow = {
  id: string;
  status: string;
  created_at: string;
  payload: Record<string, unknown> | null;
};

type PipelineColumn = {
  status: string;
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

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "agora";
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "há 1 dia" : `há ${days} dias`;
}

// ── Draggable Card ───────────────────────────────────────────────────────────

function DraftCard({ draft, isDragging = false }: { draft: DraftRow; isDragging?: boolean }) {
  const businessName = asString(
    draft.payload?.businessName ?? draft.payload?.business_name,
    "Sem nome",
  );
  const subdomain = asString(
    draft.payload?.preferredSubdomain ?? draft.payload?.preferred_subdomain,
  );
  const plan = asString(draft.payload?.selectedPlan ?? draft.payload?.plan);

  return (
    <article
      className={`rounded-lg border border-white/10 bg-[#0B1020] p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical size={14} className="mt-0.5 shrink-0 text-[var(--platform-text)]/20" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--platform-text)]">{businessName}</p>
          {subdomain && (
            <p className="mt-0.5 font-mono text-[11px] text-[#22D3EE]">
              {subdomain}.{process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || "bsph.com.br"}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between">
            {plan && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[var(--platform-text)]/60">
                {plan}
              </span>
            )}
            <span className="text-[10px] text-[var(--platform-text)]/40">
              {formatRelative(draft.created_at)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function DraggableDraftCard({ draft }: { draft: DraftRow }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draft.id,
    data: { status: draft.status },
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
      <DraftCard draft={draft} />
    </div>
  );
}

// ── Droppable Column ─────────────────────────────────────────────────────────

function DroppableColumn({
  column,
  items,
  isOver,
}: {
  column: PipelineColumn;
  items: DraftRow[];
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
      {/* Column header */}
      <div className="mb-4 flex items-center gap-2">
        <Icon size={16} className={column.color} />
        <h3 className={`text-sm font-semibold ${column.color}`}>{column.label}</h3>
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-[var(--platform-text)]/60">
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-[var(--platform-text)]/30">Nenhum item</p>
        ) : (
          items.map((draft) => <DraggableDraftCard key={draft.id} draft={draft} />)
        )}
      </div>
    </div>
  );
}

// ── Board ────────────────────────────────────────────────────────────────────

export function PipelineBoard({ drafts: initialDrafts }: { drafts: DraftRow[] }) {
  const [drafts, setDrafts] = useState<DraftRow[]>(initialDrafts);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const activeDraft = activeId ? drafts.find((d) => d.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverColumn(null);

    if (!over) return;
    const newStatus = over.id as string;
    const currentStatus = (active.data.current as { status: string } | undefined)?.status;
    if (!currentStatus || currentStatus === newStatus) return;

    const draftId = active.id as string;

    // Optimistic update
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: newStatus } : d)),
    );

    // Persist to DB
    await fetch(`/api/admin/pipeline/${draftId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {
      // Rollback on failure
      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, status: currentStatus } : d)),
      );
    });
  }

  if (drafts.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#12182B] p-12 text-center">
        <Kanban size={40} className="mx-auto text-[var(--platform-text)]/20" />
        <p className="mt-3 text-sm text-[var(--platform-text)]/50">
          Nenhum onboarding em andamento.
        </p>
      </div>
    );
  }

  const grouped = COLUMNS.map((col) => ({
    column: col,
    items: drafts.filter((d) => d.status === col.status),
  }));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={(e) => setOverColumn(e.over?.id as string ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setActiveId(null); setOverColumn(null); }}
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
        {activeDraft ? (
          <div className="rotate-1 shadow-2xl opacity-90">
            <DraftCard draft={activeDraft} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
