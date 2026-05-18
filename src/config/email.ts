function trimEnv(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Use static `import.meta.env.VITE_*` keys so Vite can inject them at build time. */
export const emailJsServiceId = trimEnv(import.meta.env.VITE_EMAILJS_SERVICE_ID);
export const emailJsTemplateId = trimEnv(import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
export const emailJsPublicKey = trimEnv(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
export const contactToEmail = trimEnv(import.meta.env.VITE_CONTACT_TO_EMAIL);

export function isEmailJsConfigured(): boolean {
  return Boolean(emailJsServiceId && emailJsTemplateId && emailJsPublicKey && contactToEmail);
}
