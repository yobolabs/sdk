/**
 * WhatsApp Client
 *
 * Main client for WhatsApp API operations:
 * - Template management (create, get status, delete)
 * - Media upload (for templates and sending)
 * - Message sending (template messages, carousel messages)
 *
 * SECURITY: This client uses getWhatsAppToken() to get tokens from
 * credentials-service. It never handles OAuth credentials directly.
 */

import { createLogger } from '../lib/logger';
import { getWhatsAppToken, resetWhatsAppTokenCache } from './token-cache';
import type {
  CreateTemplateRequest,
  CreateTemplateResponse,
  TemplateStatusResponse,
  SendTemplateMessageRequest,
  SendCarouselMessageRequest,
  SendMessageResponse,
  ConfigCheckResult,
} from './types';

const log = createLogger('WhatsAppClient');

export class WhatsAppClient {
  /**
   * Create a new WhatsAppClient
   *
   * Note: No credentials needed - tokens are fetched from credentials-service
   */
  constructor() {
    log.debug('WhatsAppClient initialized (credentials managed by credentials-service)');
  }

  /**
   * Make an authenticated request to the WhatsApp API
   */
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    // Get token and apiUrl from credentials-service
    const tokenData = await getWhatsAppToken();
    const { accessToken, apiUrl } = tokenData;

    log.debug(`WhatsApp API request: ${method} ${path}`);

    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`WhatsApp API error: ${response.status}`, undefined, {
        path,
        error: errorText,
      });
      throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // ========== Media Upload ==========

  /**
   * Upload media for template creation (uses URL-based upload)
   * Uses /api/v1/whatsapp/media/upload/handle API
   */
  async uploadMediaForTemplate(imageUrl: string): Promise<string> {
    log.debug('Uploading media for template', { imageUrl });

    const tokenData = await getWhatsAppToken();
    const { accessToken, apiUrl } = tokenData;
    const uploadUrl = `${apiUrl}/api/v1/whatsapp/media/upload/handle`;

    const formData = new FormData();
    formData.append('media_url', imageUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error('Failed to upload media for template', undefined, { error: errorText });
      throw new Error(`Failed to upload media: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as { handle: string };
    log.info('Media uploaded for template', { handle: data.handle });
    return data.handle;
  }

  /**
   * Upload media for message sending
   * Uses /api/v1/whatsapp/media/upload/by-sender API
   */
  async uploadMediaForSending(imageUrl: string): Promise<string> {
    log.debug('Uploading media for sending', { imageUrl });

    const tokenData = await getWhatsAppToken();
    const { accessToken, apiUrl } = tokenData;

    // Download image first
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const buffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Upload to WhatsApp
    const uploadUrl = `${apiUrl}/api/v1/whatsapp/media/upload/by-sender`;
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: contentType }), 'promo.png');
    formData.append('sender_label', 'META_DEFAULT');
    formData.append('file_name', 'promo.png');

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error('Failed to upload media for sending', undefined, { error: errorText });
      throw new Error(`Failed to upload media: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as { media_id: string };
    log.info('Media uploaded for sending', { mediaId: data.media_id });
    return data.media_id;
  }

  // ========== Template Management ==========

  /**
   * Create a new WhatsApp template
   * Uses /api/v1/whatsapp/templates API
   */
  async createTemplate(data: CreateTemplateRequest): Promise<CreateTemplateResponse> {
    log.info('Creating WhatsApp template', { name: data.name, category: data.category });
    log.debug('Template request data', { components: JSON.stringify(data.components) });

    const response = (await this.request('POST', '/api/v1/whatsapp/templates', data)) as {
      id?: string;
      ProviderTemplateID?: string;
      Status?: string;
      error?: string;
      rejected_reason?: string;
      quality_score?: { score?: string; reasons?: string[] };
    };

    // Log full response for debugging
    log.debug('Template creation response', { response: JSON.stringify(response) });

    // Log warning if template was rejected
    if (response.Status === 'REJECTED') {
      log.warn('Template was rejected by WhatsApp', {
        name: data.name,
        status: response.Status,
        rejectedReason: response.rejected_reason,
        error: response.error,
        qualityScore: response.quality_score,
      });
    }

    return {
      success: response.Status !== 'REJECTED',
      templateId: response.ProviderTemplateID || response.id,
      status: response.Status,
    };
  }

  /**
   * Sync template status from WhatsApp
   * Uses /api/v1/whatsapp/templates/{id}/sync API
   */
  async getTemplateStatus(templateId: string): Promise<TemplateStatusResponse> {
    log.debug('Syncing template status', { templateId });

    const response = (await this.request(
      'GET',
      `/api/v1/whatsapp/templates/${templateId}/sync`
    )) as {
      Status?: string;
      Name?: string;
      Category?: string;
    };

    return {
      success: true,
      status: response.Status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined,
      name: response.Name,
      category: response.Category,
    };
  }

  /**
   * Delete a template
   * Uses /api/v1/whatsapp/templates/{id} API
   */
  async deleteTemplate(templateId: string): Promise<{ success: boolean; status: number }> {
    log.info('Deleting WhatsApp template', { templateId });

    const tokenData = await getWhatsAppToken();
    const { accessToken, apiUrl } = tokenData;
    const url = `${apiUrl}/api/v1/whatsapp/templates/${templateId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: response.ok,
      status: response.status,
    };
  }

  // ========== Message Sending ==========

  /**
   * Send a template message
   * Uses /api/v1/whatsapp/send/template API
   * Uses image URL directly (no pre-upload needed)
   */
  async sendTemplateMessage(params: SendTemplateMessageRequest): Promise<SendMessageResponse> {
    const { templateId, phoneNumber, imageUrl, metadata, bodyParameters } = params;

    log.debug('Sending template message', { templateId, phoneNumber, hasImage: !!imageUrl });

    // Build body parameters
    const bodyParams =
      bodyParameters?.map((value) => ({
        type: 'text',
        text: value,
      })) || [];

    const requestBody = {
      sender_label: 'META_DEFAULT',
      provider_template_id: templateId,
      recipient_phone_number: phoneNumber,
      metadata: metadata || {},
      components: [
        {
          type: 'header',
          parameters: imageUrl
            ? [
                {
                  type: 'image',
                  image: {
                    link: imageUrl, // Use image URL directly
                  },
                },
              ]
            : [],
        },
        {
          type: 'body',
          parameters: bodyParams,
        },
      ],
    };

    const response = (await this.request('POST', '/api/v1/whatsapp/send/template', requestBody)) as {
      ProviderMessageID?: string;
      Status?: string;
    };

    log.info('Template message sent', { templateId, messageId: response.ProviderMessageID });

    return {
      success: true,
      messageId: response.ProviderMessageID,
    };
  }

  /**
   * Send a carousel message
   * Uses /api/v1/whatsapp/send/template API with carousel components
   * Uses image URLs directly (no pre-upload needed)
   */
  async sendCarouselMessage(params: SendCarouselMessageRequest): Promise<SendMessageResponse> {
    const { templateId, phoneNumber, cards, metadata, mainBodyParameters, cardBodyParameters } =
      params;

    log.debug('Sending carousel message', {
      templateId,
      phoneNumber,
      cardCount: cards.length,
    });

    // Build carousel cards
    const carouselCards = cards.map((card, index) => {
      const cardComponents: Array<{ type: string; parameters: unknown[] }> = [];

      // Add HEADER with image if available
      if (card.imageUrl) {
        cardComponents.push({
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: card.imageUrl,
              },
            },
          ],
        });
      }

      // Add BODY with variables if available for this card
      if (cardBodyParameters && cardBodyParameters[index]?.length > 0) {
        cardComponents.push({
          type: 'body',
          parameters: cardBodyParameters[index].map((value) => ({
            type: 'text',
            text: value,
          })),
        });
      }

      return {
        card_index: index,
        components: cardComponents,
      };
    });

    // Build main components array
    const components: Array<{ type: string; parameters?: unknown[]; cards?: unknown[] }> = [];

    // Add BODY component for main carousel header (if parameters provided)
    if (mainBodyParameters && mainBodyParameters.length > 0) {
      components.push({
        type: 'body',
        parameters: mainBodyParameters.map((value) => ({
          type: 'text',
          text: value,
        })),
      });
    }

    // Add CAROUSEL component
    components.push({
      type: 'carousel',
      cards: carouselCards,
    });

    const requestBody = {
      sender_label: 'META_DEFAULT',
      provider_template_id: templateId,
      recipient_phone_number: phoneNumber,
      metadata: metadata || {},
      components: components,
    };

    const response = (await this.request('POST', '/api/v1/whatsapp/send/template', requestBody)) as {
      ProviderMessageID?: string;
      Status?: string;
    };

    log.info('Carousel message sent', { templateId, cardCount: cards.length, messageId: response.ProviderMessageID });

    return {
      success: true,
      messageId: response.ProviderMessageID,
    };
  }

  // ========== Configuration ==========

  /**
   * Check configuration status
   */
  async checkConfig(): Promise<ConfigCheckResult> {
    try {
      const tokenData = await getWhatsAppToken();
      return {
        configured: true,
        apiUrl: tokenData.apiUrl,
      };
    } catch {
      return {
        configured: false,
        apiUrl: '',
      };
    }
  }

  /**
   * Reset the token cache (useful for testing)
   */
  resetTokenCache(): void {
    resetWhatsAppTokenCache();
  }
}
