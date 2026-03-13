"use client";

import { useState } from "react";
import {
  Tag,
  Layers,
  DollarSign,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  Copy,
  Check,
  X,
  ChevronDown,
  Info,
  Zap,
  Gift,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  key: string;
  name: string;
  monthly_price: number;
  stripe_price_id: string;
  updated_at: string;
};

type Coupon = {
  id: string;
  code: string;
  name: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  duration: "once" | "repeating" | "forever";
  duration_in_months: number | null;
  applicable_plans: string[] | null;
  max_redemptions: number | null;
  expires_at: string | null;
  stripe_coupon_id: string | null;
  stripe_promotion_code_id: string | null;
  active: boolean;
  redemption_count: number;
  created_at: string;
};

type Props = {
  initialPlans: Plan[];
  initialCoupons: Coupon[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function discountLabel(c: Coupon): string {
  if (c.percent_off !== null) {
    if (c.percent_off === 100) {
      if (c.duration === "once") return "1º mês grátis";
      if (c.duration === "repeating") return `${c.duration_in_months} meses grátis`;
      return "Grátis para sempre";
    }
    if (c.duration === "once") return `${c.percent_off}% no 1º mês`;
    if (c.duration === "repeating") return `${c.percent_off}% por ${c.duration_in_months} meses`;
    return `${c.percent_off}% para sempre`;
  }
  if (c.amount_off_cents !== null) {
    const brl = formatBRL(c.amount_off_cents / 100);
    if (c.duration === "once") return `${brl} no 1º mês`;
    if (c.duration === "repeating") return `${brl} por ${c.duration_in_months} meses`;
    return `${brl} para sempre`;
  }
  return "—";
}

function planLabel(p: string) {
  return p === "basico" ? "Básico" : "Premium";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PlansPromotionsClient({ initialPlans, initialCoupons }: Props) {
  const [tab, setTab] = useState<"plans" | "coupons">("plans");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 rounded-xl bg-white/[0.04] p-1 w-fit">
        {(["plans", "coupons"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                : "text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
            }`}
          >
            {t === "plans" ? <Layers size={15} /> : <Tag size={15} />}
            {t === "plans" ? "Planos" : "Cupons & Promoções"}
          </button>
        ))}
      </div>

      {tab === "plans" && <PlansTab plans={plans} setPlans={setPlans} />}
      {tab === "coupons" && <CouponsTab coupons={coupons} setCoupons={setCoupons} />}
    </div>
  );
}

// ─── Plans Tab ────────────────────────────────────────────────────────────────

function PlansTab({ plans, setPlans }: { plans: Plan[]; setPlans: (p: Plan[]) => void }) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSavePrice(plan: Plan) {
    const price = parseFloat(newPrice.replace(",", "."));
    if (isNaN(price) || price < 1) {
      setError("Informe um preço válido.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: plan.key, monthly_price: price }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao atualizar preço.");
      } else {
        setPlans(
          plans.map((p) =>
            p.key === plan.key
              ? { ...p, monthly_price: data.monthly_price, stripe_price_id: data.stripe_price_id }
              : p,
          ),
        );
        setSuccess(`Preço do plano ${plan.name} atualizado com sucesso!`);
        setEditingKey(null);
        setNewPrice("");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <Check size={15} />
          {success}
        </div>
      )}

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
        <Info size={15} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300">
          Alterar o preço cria um novo Price no Stripe e arquiva o anterior. Assinaturas existentes
          não são afetadas automaticamente — gerencie renovações diretamente no Stripe Dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.key} className="rounded-2xl border border-white/10 bg-[#12182B] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#22D3EE] mb-1">
                  {plan.key === "premium" ? "Recomendado" : "Básico"}
                </div>
                <h3 className="text-lg font-bold text-[var(--platform-text)]">{plan.name}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22D3EE]/10">
                <DollarSign size={18} className="text-[#22D3EE]" />
              </div>
            </div>

            <div className="mb-1">
              <span className="text-3xl font-extrabold text-[var(--platform-text)]">
                {formatBRL(plan.monthly_price)}
              </span>
              <span className="text-sm text-[var(--platform-text)]/50">/mês</span>
            </div>

            <p className="text-[11px] text-[var(--platform-text)]/40 font-mono mb-4 break-all">
              {plan.stripe_price_id}
            </p>

            {editingKey === plan.key ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[var(--platform-text)]/60">R$</span>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder={plan.monthly_price.toFixed(2)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSavePrice(plan)}
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSavePrice(plan)}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-[#22D3EE]/15 py-2 text-xs font-semibold text-[#22D3EE] hover:bg-[#22D3EE]/25 disabled:opacity-50 transition"
                  >
                    {saving ? "Salvando..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => { setEditingKey(null); setError(""); setNewPrice(""); }}
                    className="flex-1 rounded-lg bg-white/[0.04] py-2 text-xs text-[var(--platform-text)]/60 hover:bg-white/[0.08] transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setEditingKey(plan.key); setNewPrice(""); setError(""); setSuccess(""); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-medium text-[var(--platform-text)]/60 hover:border-[#22D3EE]/30 hover:text-[#22D3EE] transition"
              >
                <Pencil size={13} />
                Alterar preço
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Coupons Tab ──────────────────────────────────────────────────────────────

function CouponsTab({
  coupons,
  setCoupons,
}: {
  coupons: Coupon[];
  setCoupons: (c: Coupon[]) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function toggleActive(coupon: Coupon) {
    setTogglingId(coupon.id);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (res.ok) {
        setCoupons(coupons.map((c) => (c.id === coupon.id ? { ...c, active: !coupon.active } : c)));
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteCoupon(id: string) {
    if (!confirm("Remover este cupom? Ele será desativado no Stripe.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--platform-text)]/50">
          {coupons.length} cupom{coupons.length !== 1 ? "s" : ""} cadastrado{coupons.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22D3EE]/15 px-4 py-2 text-sm font-semibold text-[#22D3EE] hover:bg-[#22D3EE]/25 transition"
        >
          <Plus size={15} />
          Novo cupom
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22D3EE]/10">
            <Gift size={22} className="text-[#22D3EE]" />
          </div>
          <p className="text-sm text-[var(--platform-text)]/50">Nenhum cupom criado ainda.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-1 text-xs font-semibold text-[#22D3EE] hover:underline"
          >
            Criar primeiro cupom
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Desconto
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Planos
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Usos
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Expira
                </th>
                <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.1em] text-[var(--platform-text)]/40">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition">
                  {/* Code */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${coupon.active ? "bg-emerald-400" : "bg-[var(--platform-text)]/20"}`}
                      />
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="group flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--platform-text)] hover:text-[#22D3EE] transition"
                        title="Copiar código"
                      >
                        {coupon.code}
                        {copiedCode === coupon.code ? (
                          <Check size={11} className="text-emerald-400" />
                        ) : (
                          <Copy size={11} className="opacity-0 group-hover:opacity-60 transition" />
                        )}
                      </button>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--platform-text)]/40 pl-4">
                      {coupon.name}
                    </p>
                  </td>

                  {/* Discount */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#7C5CFF]/15 px-2 py-0.5 text-[11px] font-semibold text-[#a78bfa]">
                      <Zap size={10} />
                      {discountLabel(coupon)}
                    </span>
                  </td>

                  {/* Plans */}
                  <td className="hidden sm:table-cell px-4 py-3 text-xs text-[var(--platform-text)]/60">
                    {coupon.applicable_plans?.length
                      ? coupon.applicable_plans.map(planLabel).join(", ")
                      : "Todos"}
                  </td>

                  {/* Uses */}
                  <td className="hidden md:table-cell px-4 py-3 text-xs text-[var(--platform-text)]/60">
                    {coupon.redemption_count}
                    {coupon.max_redemptions !== null ? `/${coupon.max_redemptions}` : ""}
                  </td>

                  {/* Expires */}
                  <td className="hidden lg:table-cell px-4 py-3 text-xs text-[var(--platform-text)]/60">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleDateString("pt-BR")
                      : "Sem limite"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(coupon)}
                        disabled={togglingId === coupon.id}
                        title={coupon.active ? "Desativar" : "Ativar"}
                        className="rounded-lg p-1.5 text-[var(--platform-text)]/40 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition disabled:opacity-50"
                      >
                        {coupon.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        disabled={deletingId === coupon.id}
                        title="Remover"
                        className="rounded-lg p-1.5 text-[var(--platform-text)]/40 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateCouponModal
          onClose={() => setShowModal(false)}
          onCreated={(newCoupon) => {
            setCoupons([newCoupon, ...coupons]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Create Coupon Modal ──────────────────────────────────────────────────────

type DiscountPreset = {
  label: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  duration: "once" | "repeating" | "forever";
  duration_in_months: number | null;
};

const PRESETS: DiscountPreset[] = [
  { label: "1º mês grátis", percent_off: 100, amount_off_cents: null, duration: "once", duration_in_months: null },
  { label: "3 meses grátis", percent_off: 100, amount_off_cents: null, duration: "repeating", duration_in_months: 3 },
  { label: "X% no 1º mês", percent_off: 50, amount_off_cents: null, duration: "once", duration_in_months: null },
  { label: "X% por 3 meses", percent_off: 50, amount_off_cents: null, duration: "repeating", duration_in_months: 3 },
  { label: "X% sempre", percent_off: 20, amount_off_cents: null, duration: "forever", duration_in_months: null },
  { label: "Personalizado", percent_off: null, amount_off_cents: null, duration: "once", duration_in_months: null },
];

function CreateCouponModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: Coupon) => void;
}) {
  const [preset, setPreset] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [percentOff, setPercentOff] = useState("");
  const [amountOff, setAmountOff] = useState("");
  const [duration, setDuration] = useState<"once" | "repeating" | "forever">("once");
  const [durationMonths, setDurationMonths] = useState("");
  const [applicablePlans, setApplicablePlans] = useState<string[]>([]);
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function applyPreset(index: number) {
    setPreset(index);
    const p = PRESETS[index];
    setDuration(p.duration);
    setDurationMonths(p.duration_in_months ? String(p.duration_in_months) : "");
    if (p.percent_off !== null) {
      setDiscountType("percent");
      setPercentOff(String(p.percent_off));
    } else {
      // personalizado — mantém campos
    }
  }

  function togglePlan(key: string) {
    setApplicablePlans((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const body: Record<string, unknown> = {
      code,
      name,
      duration,
      duration_in_months: duration === "repeating" ? parseInt(durationMonths) || null : null,
      applicable_plans: applicablePlans.length > 0 ? applicablePlans : null,
      max_redemptions: maxRedemptions ? parseInt(maxRedemptions) : null,
      expires_at: expiresAt || null,
    };

    if (discountType === "percent") {
      body.percent_off = parseFloat(percentOff.replace(",", ".")) || null;
    } else {
      const brl = parseFloat(amountOff.replace(",", ".")) || 0;
      body.amount_off_cents = brl > 0 ? Math.round(brl * 100) : null;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar cupom.");
      } else {
        onCreated(data.coupon);
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0D1426] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CFF]/15">
              <Tag size={15} className="text-[#a78bfa]" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--platform-text)]">Novo cupom</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--platform-text)]/40 hover:text-[var(--platform-text)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form id="create-coupon-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Presets */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[var(--platform-text)]/40 mb-2">
              Tipo de promoção
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(i)}
                  className={`rounded-lg border px-2 py-2 text-[11px] font-medium text-center transition ${
                    preset === i
                      ? "border-[#7C5CFF]/50 bg-[#7C5CFF]/10 text-[#a78bfa]"
                      : "border-white/10 text-[var(--platform-text)]/60 hover:border-white/20 hover:text-[var(--platform-text)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Code */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">
                Código público *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
                placeholder="EX: PROMO50"
                maxLength={30}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-mono text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50 placeholder:text-[var(--platform-text)]/20"
              />
            </div>

            {/* Name */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">
                Nome interno *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lançamento 2026"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50 placeholder:text-[var(--platform-text)]/20"
              />
            </div>
          </div>

          {/* Discount type + value */}
          <div>
            <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">Desconto *</label>
            <div className="flex gap-2 mb-2">
              {(["percent", "amount"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDiscountType(t)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                    discountType === t
                      ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                      : "bg-white/[0.04] text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                  }`}
                >
                  {t === "percent" ? "Percentual (%)" : "Valor fixo (R$)"}
                </button>
              ))}
            </div>
            {discountType === "percent" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  step="0.01"
                  required
                  value={percentOff}
                  onChange={(e) => setPercentOff(e.target.value)}
                  placeholder="50"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50"
                />
                <span className="text-sm text-[var(--platform-text)]/50 shrink-0">%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--platform-text)]/50 shrink-0">R$</span>
                <input
                  type="text"
                  required
                  value={amountOff}
                  onChange={(e) => setAmountOff(e.target.value)}
                  placeholder="59,90"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50"
                />
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">Duração *</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(["once", "repeating", "forever"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-lg py-1.5 text-xs font-medium transition ${
                    duration === d
                      ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                      : "bg-white/[0.04] text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                  }`}
                >
                  {d === "once" ? "1 vez" : d === "repeating" ? "N meses" : "Sempre"}
                </button>
              ))}
            </div>
            {duration === "repeating" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  placeholder="3"
                  className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50"
                />
                <span className="text-xs text-[var(--platform-text)]/50">meses</span>
              </div>
            )}
          </div>

          {/* Plan restriction */}
          <div>
            <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">
              Restringir a plano <span className="text-[var(--platform-text)]/30">(vazio = todos)</span>
            </label>
            <div className="flex gap-2">
              {["basico", "premium"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlan(p)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    applicablePlans.includes(p)
                      ? "bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#93c5fd]"
                      : "bg-white/[0.04] border border-white/10 text-[var(--platform-text)]/50 hover:text-[var(--platform-text)]"
                  }`}
                >
                  {planLabel(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Limits row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">
                Limite de usos <span className="text-[var(--platform-text)]/30">(vazio = ∞)</span>
              </label>
              <input
                type="number"
                min={1}
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="∞"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50 placeholder:text-[var(--platform-text)]/20"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--platform-text)]/60 mb-1.5">
                Expiração <span className="text-[var(--platform-text)]/30">(vazio = sem limite)</span>
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--platform-text)] outline-none focus:border-[#22D3EE]/50"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-white/10 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/[0.04] py-2.5 text-sm text-[var(--platform-text)]/60 hover:bg-white/[0.08] transition"
          >
            Cancelar
          </button>
          <button
            form="create-coupon-form"
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-[#7C5CFF]/20 py-2.5 text-sm font-semibold text-[#a78bfa] hover:bg-[#7C5CFF]/30 disabled:opacity-50 transition"
          >
            {saving ? "Criando no Stripe..." : "Criar cupom"}
          </button>
        </div>
      </div>
    </div>
  );
}
