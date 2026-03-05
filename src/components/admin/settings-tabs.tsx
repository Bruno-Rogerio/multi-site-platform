"use client";

import { Globe, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";

import { ClientSettingsForm } from "@/components/admin/client-settings-form";
import { DomainChangeSection } from "@/components/admin/domain-change-section";
import { PlanUpgradeSection } from "@/components/admin/plan-upgrade-section";

type Tab = "conta" | "dominio" | "plano";

type Props = {
  email: string;
  siteName: string;
  siteDomain: string;
  siteId: string;
  selectedPlan: string;
  themeSettings: Record<string, unknown>;
  initialTab?: Tab;
  domainSuccess?: boolean;
};

const TABS: { key: Tab; label: string; icon: typeof Settings2 }[] = [
  { key: "conta",   label: "Conta",   icon: Settings2 },
  { key: "dominio", label: "Domínio", icon: Globe },
  { key: "plano",   label: "Plano",   icon: Sparkles },
];

export function SettingsTabs({
  email,
  siteName,
  siteDomain,
  siteId,
  selectedPlan,
  themeSettings,
  initialTab = "conta",
  domainSuccess = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const isPremium = selectedPlan === "premium-full";

  return (
    <>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-[#12182B] p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const showDot = tab.key === "plano" && !isPremium;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                  : "text-[var(--platform-text)]/50 hover:bg-white/[0.04] hover:text-[var(--platform-text)]"
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {showDot && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "conta" && (
        <ClientSettingsForm
          email={email}
          siteName={siteName}
          siteDomain={siteDomain}
          siteId={siteId}
          selectedPlan={selectedPlan}
          themeSettings={themeSettings}
        />
      )}
      {activeTab === "dominio" && (
        <DomainChangeSection
          siteId={siteId}
          currentDomain={siteDomain}
          domainSuccess={domainSuccess}
        />
      )}
      {activeTab === "plano" && (
        <PlanUpgradeSection selectedPlan={selectedPlan} siteId={siteId} />
      )}
    </>
  );
}
