import { html } from 'lit'
import { Router } from '@thepassle/app-tools/router.js'
import { data } from '@thepassle/app-tools/router/plugins/data.js'
import { api } from '@thepassle/app-tools/api.js'

// views
import '../views/Map.js'
import '../views/Home.js'

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
      path: '/m/:mapId',
      title: ({ params }) => `ethermap | ${params.mapId}`,
      // plugins: [
      //   data((ctx) => api.get(`/api/map/${ctx.params.mapId}`))
      // ],
      // render: (ctx) => html`<map-view .map=${ctx.data}></map-view>`,
      render: (ctx) => html`<map-view name=${ctx.params.mapId}></map-view>`,
    },
    {
      path: '/404',
      title: 'etherpad | 404',
      render: () => html`<h2>404 : page not found</h2>`,
    },
  ],
})
