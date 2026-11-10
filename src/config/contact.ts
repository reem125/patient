/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Vision Medical contact details used across the guide.
// WhatsApp number in international format, digits only, e.g. '9665XXXXXXXX' (no +, spaces or leading 0).
export const CLINIC_WHATSAPP = '';

// Booking buttons are hidden until a real number is set, so patients never reach a dead link.
export const hasClinicWhatsapp = /^\d{10,15}$/.test(CLINIC_WHATSAPP);

export const whatsappLink = (message: string) =>
  `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
