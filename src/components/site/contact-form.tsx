"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  siteId: string;
  submitLabel: string;
  buttonStyleClassName: string;
};

export function ContactForm({
  siteId,
  submitLabel,
  buttonStyleClassName,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      siteId,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not send message.");
      }

      setStatusType("success");
      setStatusMessage("Mensagem enviada! Vamos responder em breve.");
      form.reset();
    } catch {
      setStatusType("error");
      setStatusMessage("Nao foi possivel enviar agora. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        required
        name="name"
        type="text"
        placeholder="Seu nome"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--site-primary)] transition focus:ring-2"
      />
      <input
        required
        name="email"
        type="email"
        placeholder="Seu e-mail"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--site-primary)] transition focus:ring-2"
      />
      <textarea
        required
        name="message"
        rows={4}
        placeholder="Como posso te ajudar?"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--site-primary)] transition focus:ring-2"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[var(--site-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyleClassName}`}
      >
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
      {statusMessage && (
        <p
          className={`text-xs ${
            statusType === "success" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
