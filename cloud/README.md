# @yobo/cloud

AWS service wrappers for Yobo Platform. This SDK provides a clean interface to cloud operations while hiding AWS credentials and implementation details.

## Features

- **S3 Operations**: File upload, download, and signed URL generation
- **SQS Operations**: Message queue operations
- **SES Operations**: Email sending and template management

## Installation

```bash
pnpm add @yobo/cloud
```

## Usage

### S3 Storage

```typescript
import { s3 } from '@yobo/cloud';

// Upload file
const url = await s3.upload({
  bucket: 'campaigns',
  key: 'banner.jpg',
  file: buffer,
});

// Get signed URL
const signedUrl = await s3.getSignedUrl({
  bucket: 'campaigns',
  key: 'banner.jpg',
  expiresIn: 3600,
});

// Download file
const file = await s3.download({
  bucket: 'campaigns',
  key: 'banner.jpg',
});
```

### SQS Queue Operations

```typescript
import { sqs } from '@yobo/cloud';

// Send message
await sqs.sendMessage({
  queue: 'campaign-processor',
  message: { campaignId: 123 },
});

// Receive messages
const messages = await sqs.receiveMessages({
  queue: 'campaign-processor',
  maxMessages: 10,
});
```

### SES Email Operations

```typescript
import { ses } from '@yobo/cloud';

// Send email
await ses.sendEmail({
  to: 'customer@example.com',
  template: 'campaign-launched',
  data: { campaignName: 'Black Friday' },
});
```

## Configuration

Set these environment variables in your application:

```bash
CLOUD_SERVICE_URL=https://cloud.yobo.net
CLOUD_API_KEY=your_api_key
```

## What's Protected

- AWS access keys and secrets
- S3 bucket configurations
- Service endpoint URLs
- Retry and rate limiting logic

## License

PRIVATE - Proprietary and confidential
