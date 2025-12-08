/**
 * WhatsApp SDK Module
 *
 * Provides WhatsApp API integration through Credentials Service.
 *
 * @example
 * ```typescript
 * import { whatsapp } from '@yobolabs/cloud/whatsapp';
 *
 * // Send a template message
 * const result = await whatsapp.sendTemplateMessage({
 *   templateId: 'my_template',
 *   phoneNumber: '6281234567890',
 *   bodyParameters: ['John', 'Order #123'],
 * });
 *
 * // Send a carousel message
 * const carouselResult = await whatsapp.sendCarouselMessage({
 *   templateId: 'carousel_template',
 *   phoneNumber: '6281234567890',
 *   cards: [
 *     { imageUrl: 'https://example.com/image1.jpg', bodyParameters: ['Product 1'] },
 *     { imageUrl: 'https://example.com/image2.jpg', bodyParameters: ['Product 2'] },
 *   ],
 * });
 * ```
 */

// Types
export type {
  WhatsAppCredentials,
  WhatsAppTokenResponse,
  MediaUploadResponse,
  TemplateComponent,
  CreateTemplateRequest,
  CreateTemplateResponse,
  TemplateStatusResponse,
  SendTemplateMessageRequest,
  SendCarouselMessageRequest,
  SendMessageResponse,
  CarouselCard,
  ConfigCheckResult,
} from './types';

// Classes
export { WhatsAppClient } from './client';
export { WhatsAppTokenCache } from './token-cache';

// Factory
export { createWhatsAppClient, getWhatsAppClient, resetWhatsAppClient, whatsapp } from './factory';
