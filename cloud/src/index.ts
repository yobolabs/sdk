/**
 * @yobolabs/cloud - Cloud service integrations
 *
 * Provides AWS service wrappers for the Yobo platform.
 *
 * @example
 * ```ts
 * // Simple usage with convenience export
 * import { storage } from '@yobolabs/cloud/storage';
 *
 * const result = await storage.uploadBuffer(buffer, 'image.png', { folder: 'uploads' });
 * console.log(result.url);
 *
 * // Or create your own client
 * import { createStorageClient } from '@yobolabs/cloud/storage';
 * const client = createStorageClient();
 * await client.upload({ buffer, key: 'uploads/file.txt' });
 * ```
 */

// Re-export storage module
export * from './storage';

// Re-export config module
export * from './config';

// Re-export lib module
export * from './lib';
