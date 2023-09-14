import { html } from 'lit'
import { Router } from '@thepassle/app-tools/router.js'

// views
import '../components/MapView.js'
import '../components/NewMapModal.js'

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
      render: () => html`
        <map-view></map-view>
        <newmap-modal></newmap-modal>
      `
    },
    {
      path: '/m/:mapId',
      title: ({ params }) => `ethermap | ${params.mapId}`,
      render: ({ params }) => html`<map-view name=${params.mapId}></map-view>`
    },
    {
      path: '/404',
      title: 'etherpad | 404',
      render: () => html`<h2>404 : page not found</h2>`
    }
  ]
})
