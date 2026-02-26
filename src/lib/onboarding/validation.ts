/* ─── Validation utilities for the wizard ─── */

/* ─── Subdomain validation ─── */

const SUBDOMAIN_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
const RESERVED_SUBDOMAINS = ["app", "admin", "www", "api", "dashboard", "mail", "ftp", "cdn", "static"];

export function normalizeSubdomain(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9-]/g, "-") // Replace invalid chars with dash
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  const normalized = normalizeSubdomain(subdomain);

  if (normalized.length < 3) {
    return { valid: false, error: "O subdomínio deve ter pelo menos 3 caracteres" };
  }

  if (normalized.length > 30) {
    return { valid: false, error: "O subdomínio deve ter no máximo 30 caracteres" };
  }

  if (!SUBDOMAIN_REGEX.test(normalized)) {
    return { valid: false, error: "Use apenas letras, números e hífens" };
  }

  if (RESERVED_SUBDOMAINS.includes(normalized)) {
    return { valid: false, error: "Este subdomínio não está disponível" };
  }

  return { valid: true };
}

/* ─── Password validation ─── */

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push("Mínimo de 10 caracteres");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Uma letra minúscula");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Uma letra maiúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password)) {
    errors.push("Um caractere especial");
  }

  return { valid: errors.length === 0, errors };
}

/* ─── Document validation (CPF/CNPJ) ─── */

export function normalizeDocument(input: string): string {
  return input.replace(/\D/g, "");
}

export function detectDocumentType(doc: string): "cpf" | "cnpj" | null {
  const normalized = normalizeDocument(doc);
  if (normalized.length === 11) return "cpf";
  if (normalized.length === 14) return "cnpj";
  return null;
}

function checkCPF(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false; // all same digits
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem >= 10) rem = 0;
  if (rem !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem >= 10) rem = 0;
  return rem === parseInt(digits[10]);
}

function checkCNPJ(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false; // all same digits
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * w1[i];
  let rem = sum % 11;
  const d1 = rem < 2 ? 0 : 11 - rem;
  if (d1 !== parseInt(digits[12])) return false;
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * w2[i];
  rem = sum % 11;
  const d2 = rem < 2 ? 0 : 11 - rem;
  return d2 === parseInt(digits[13]);
}

export function validateDocument(doc: string): { valid: boolean; type: "cpf" | "cnpj" | null; error?: string } {
  const normalized = normalizeDocument(doc);
  const type = detectDocumentType(normalized);

  if (!type) {
    return { valid: false, type: null, error: "CPF deve ter 11 dígitos, CNPJ deve ter 14" };
  }

  const isValid = type === "cpf" ? checkCPF(normalized) : checkCNPJ(normalized);
  if (!isValid) {
    return { valid: false, type, error: type === "cpf" ? "CPF inválido" : "CNPJ inválido" };
  }

  return { valid: true, type };
}

/* ─── Email validation ─── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email.trim()) {
    return { valid: false, error: "Email é obrigatório" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Email inválido" };
  }

  return { valid: true };
}

/* ─── Hex color validation ─── */

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function validateHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

export function normalizeHexColor(color: string): string {
  let hex = color.trim();
  if (!hex.startsWith("#")) hex = "#" + hex;
  return hex.toUpperCase();
}
