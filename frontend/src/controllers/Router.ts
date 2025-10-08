import { html } from 'lit'
import { type Context, Router } from '@thepassle/app-tools/router.js'
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js'

// @ts-ignore
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill')
}

// router
const router: Router = new Router({
  fallback: '/404',
  routes: [
    {
      path: '',
      title: 'ethermap | index',
      plugins: [
        lazy(() => import('../views/Home'))
      ],
      render: () => html`<home-view></home-view>`,
    },
    {
      path: '/m/:mapName',
      title: (ctx: Partial<Context>) => `ethermap | ${ctx.params?.mapName}`,
      plugins: [
        lazy(() => import('../views/Map'))
      ],
      render: (ctx: Context) => html`<map-view .mapName=${ctx.params.mapName}></map-view>`,
    },
    {
      path: '/404',
      title: 'etherpad | 404',
      render: () => html`<h2>404 : page not found</h2>`,
    },
  ],
})

export default router
