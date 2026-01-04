import { Scalar } from '@scalar/hono-api-reference'
import type { AppOpenAPI } from '@/backend/interfaces/App'
import packageJSON from '@/package.json' with { type: 'json' }

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/api/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Ethermap API',
    },
  })

  app.get(
    '/api/reference',
    Scalar({
      url: '/api/doc',
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  )
}
