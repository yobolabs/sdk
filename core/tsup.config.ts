import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'db/index': 'src/db/index.ts',
    'db/schema/index': 'src/db/schema/index.ts',
    'auth/index': 'src/auth/index.ts',
    'trpc/index': 'src/trpc/index.ts',
    'permissions/index': 'src/permissions/index.ts',
    'ui/index': 'src/ui/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'stores/index': 'src/stores/index.ts',
    'providers/index': 'src/providers/index.ts',
    'lib/index': 'src/lib/index.ts',
    'rls/index': 'src/rls/index.ts',
    'cli/index': 'src/cli/index.ts',
    'cli/db': 'src/cli/db.ts',
    'config/index': 'src/config/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'next-auth',
    'drizzle-orm',
    '@trpc/server',
    'postgres',
  ],
})
