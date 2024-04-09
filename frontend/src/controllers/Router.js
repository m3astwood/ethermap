import { html } from 'lit'
import { Router } from '@thepassle/app-tools/router.js'

// views
import '../views/Map'
import '../views/Home'

if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill')
}

// router
export default new Router({
  fallback: '/404',
  routes: [
    {
      path: '/',
      title: 'ethermap | index',
      render: () => html`<home-view></home-view>`,
    },
    {
      path: '/m/:mapName',
      title: ({ params }) => `ethermap | ${params.mapName}`,
      render: (ctx) => html`<map-view .mapName=${ctx.params.mapName}></map-view>`,
    },
    {
      path: '/404',
      title: 'etherpad | 404',
      render: () => html`<h2>404 : page not found</h2>`,
    },
  ],
})
