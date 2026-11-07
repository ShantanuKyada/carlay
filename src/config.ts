/**
 * Demo configuration. Everything here is a placeholder until confirmed by Carlay.
 *
 * Publicly listed details found during research (NOT used below, pending client confirmation):
 *   phone +91 97666 63308, email carlayindia@gmail.com,
 *   Lane no-01, Kapil Nagar, Wadgaon Sheri Rd, opp. Novotel, Pune.
 * The demo deliberately uses a fictional number so that test WhatsApp messages
 * sent during a pitch never reach the real business.
 */
export const siteConfig = {
  brand: 'Carlay',
  city: 'Pune',
  tagline: 'Quality pre-owned cars. Trusted deals. A better way to buy and sell.',
  // Configurable demo contact number (E.164 without "+", for wa.me links)
  whatsappNumber: '919000000000',
  phoneDisplay: '+91 90000 00000',
  email: 'hello@example.com',
  addressLine: 'Wadgaon Sheri, Pune',
  addressNote: 'Area shown on Carlay’s public Facebook page — exact address and hours to be confirmed.',
  hours: 'Hours to be confirmed',
  instagramUrl: 'https://www.instagram.com/carlay.in/',
  instagramHandle: '@carlay.in',
  brotomotivUrl: 'https://brotomotiv.in',
  storageKey: 'carlay-demo-state-v1',
} as const

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
