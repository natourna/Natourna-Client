export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function occupantsText(owner: string, tenant: string | null): string {
  return tenant ? `Owner: ${owner} · Tenant: ${tenant}` : `Owner: ${owner}`;
}

export function nameFromEmail(email: string): string {
  const localPart = email.split("@")[0];
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
