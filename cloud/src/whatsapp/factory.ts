/**
 * WhatsApp Client Factory
 *
 * Creates and manages WhatsApp client instances.
 *
 * SECURITY: Token management is handled by credentials-service.
 * The client no longer requires OAuth credentials.
 */

import { createLogger } from '../lib/logger';
import { WhatsAppClient } from './client';
import { resetWhatsAppTokenCache } from './token-cache';

const log = createLogger('WhatsAppFactory');

// globalThis cache for Next.js HMR compatibility
const globalForCache = globalThis as unknown as {
  __yobo_whatsapp_client?: WhatsAppClient;
};

let whatsappClient: WhatsAppClient | null = globalForCache.__yobo_whatsapp_client ?? null;

/**
 * Create a new WhatsApp client instance
 *
 * Note: No credentials needed - tokens are fetched from credentials-service
 */
export function createWhatsAppClient(): WhatsAppClient {
  return new WhatsAppClient();
}

/**
 * Get the default WhatsApp client instance (singleton)
 */
export function getWhatsAppClient(): WhatsAppClient {
  if (!whatsappClient) {
    whatsappClient = createWhatsAppClient();
    globalForCache.__yobo_whatsapp_client = whatsappClient;
    log.debug('WhatsApp client created');
  }
  return whatsappClient;
}

/**
 * Reset the WhatsApp client and token cache
 */
export function resetWhatsAppClient(): void {
  whatsappClient = null;
  globalForCache.__yobo_whatsapp_client = undefined;
  resetWhatsAppTokenCache();
  log.debug('WhatsApp client and token cache reset');
}

/**
 * Convenience export for quick access
 *
 * Usage:
 * ```ts
 * import { whatsapp } from '@yobolabs/cloud/whatsapp';
 * await whatsapp.sendTemplateMessage({ ... });
 * ```
 */
export const whatsapp = {
  /**
   * Upload media for template creation
   */
  uploadMediaForTemplate: async (imageUrl: string) =>
    getWhatsAppClient().uploadMediaForTemplate(imageUrl),

  /**
   * Upload media for message sending
   */
  uploadMediaForSending: async (imageUrl: string) =>
    getWhatsAppClient().uploadMediaForSending(imageUrl),

  /**
   * Create a new template
   */
  createTemplate: async (...args: Parameters<WhatsAppClient['createTemplate']>) =>
    getWhatsAppClient().createTemplate(...args),

  /**
   * Get template status
   */
  getTemplateStatus: async (templateId: string) =>
    getWhatsAppClient().getTemplateStatus(templateId),

  /**
   * Delete a template
   */
  deleteTemplate: async (templateId: string) =>
    getWhatsAppClient().deleteTemplate(templateId),

  /**
   * Send a template message
   */
  sendTemplateMessage: async (...args: Parameters<WhatsAppClient['sendTemplateMessage']>) =>
    getWhatsAppClient().sendTemplateMessage(...args),

  /**
   * Send a carousel message
   */
  sendCarouselMessage: async (...args: Parameters<WhatsAppClient['sendCarouselMessage']>) =>
    getWhatsAppClient().sendCarouselMessage(...args),

  /**
   * Check configuration status
   */
  checkConfig: async () => getWhatsAppClient().checkConfig(),

  /**
   * Check if WhatsApp is configured (synchronous - checks local cache)
   */
  isConfigured: (): boolean => {
    try {
      // This is a quick check - actual config check is async
      return !!whatsappClient;
    } catch {
      return false;
    }
  },
};
