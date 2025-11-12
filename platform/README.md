# @yobo/platform

Platform service clients for Yobo Platform. This SDK provides access to core platform services like user management, organizations, and integrations.

## Features

- **User Service**: Authentication and profile management
- **Org Service**: Organization settings and hierarchy
- **WhatsApp Service**: WhatsApp Business API integration
- **Config Service**: System configuration management
- **System Service**: Health checks and monitoring

## Installation

```bash
pnpm add @yobo/platform
```

## Usage

### User Operations

```typescript
import { user } from '@yobo/platform';

// Get current user
const currentUser = await user.getCurrent();

// Update profile
await user.updateProfile({
  name: 'John Doe',
  email: 'john@example.com',
});
```

### Organization Operations

```typescript
import { org } from '@yobo/platform';

// Get org settings
const settings = await org.getSettings();

// Update settings
await org.updateSettings({
  currency: 'USD',
  timezone: 'America/New_York',
});

// Switch organization
await org.switch(newOrgId);
```

### WhatsApp Integration

```typescript
import { whatsapp } from '@yobo/platform';

// Send message
await whatsapp.sendMessage({
  to: '+1234567890',
  template: 'order-confirmation',
  data: { orderId: 123 },
});
```

### System Configuration

```typescript
import { config } from '@yobo/platform';

// Get configuration
const rateLimit = await config.get('api.rate_limit');

// Get multiple configs
const configs = await config.getMany(['api.rate_limit', 'features.campaigns']);
```

### System Health

```typescript
import { system } from '@yobo/platform';

// Health check
const health = await system.health();

// System status
const status = await system.status();
```

## Configuration

Set these environment variables in your application:

```bash
PLATFORM_SERVICE_URL=https://platform.yobo.net
PLATFORM_API_KEY=your_api_key
```

## What's Protected

- User authentication implementation
- Organization hierarchy logic
- WhatsApp API credentials
- System configuration secrets
- Service routing logic

## License

PRIVATE - Proprietary and confidential
