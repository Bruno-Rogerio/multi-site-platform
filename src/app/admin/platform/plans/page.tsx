import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PlansPromotionsClient } from "./plans-promotions-client";

export default async function PlansPage() {
  await requireUserProfile(["admin"]);

  const admin = createSupabaseAdminClient();

  const [plansResult, couponsResult] = await Promise.all([
    admin?.from("platform_plans").select("*").order("monthly_price", { ascending: true }),
    admin?.from("platform_coupons").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Planos & Promoções</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie preços dos planos e cupons de desconto sincronizados com o Stripe.
        </p>
      </div>

      <PlansPromotionsClient
        initialPlans={plansResult?.data ?? []}
        initialCoupons={couponsResult?.data ?? []}
      />
    </div>
  );
}
