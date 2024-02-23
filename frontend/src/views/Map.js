import { LitElement, html, css, unsafeCSS, render } from 'lit'

import io from '../api/socket.js'

import { api } from '@thepassle/app-tools/api.js'
import { Task } from '@lit/task'

import L from 'leaflet'
import 'leaflet-contextmenu'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import leafletCss from 'leaflet/dist/leaflet.css'

import UserCursor from '../controllers/UserCursor'
import '../components/PointPopup.js'

class MapView extends LitElement {
  userCursor = new UserCursor(this)

  static properties = {
    map: { type: Object },
    mapId: { state: true },
    leafletMap: { state: true },
    points: { state: true },
  }

  constructor() {
    super()
    this.points = new Map()
  }

  mapTask = new Task(this, {
    task: async ([map]) => {
      const m = await map
      this.mapId = m.map.id

      // io connect to map
      io.emit('connect-map', this.mapId)
      const latlngs = []

      for (const point of m.points) {
        latlngs.push(point.location)
        this.points.set(point.id, this._createPointMarker(point))
      }

      if (latlngs.length > 0) {
        this.leafletMap
          .fitBounds(latlngs, {
            paddingTopLeft: [20, 20],
            paddingBottomRight: [20, 20],
          })
      } else {
        this.leafletMap
          .fitWorld()
          .setZoom(3)
      }
    },
    args: () => [this.map],
  })

  _createPointMarker(point) {
    const m = L.marker(point.location).addTo(this.leafletMap)

    const div = document.createElement('div')
    render(html`<em-marker-popup .point=${point}></em-marker-popup>`, div)

    m.bindPopup(div)

    return m
  }

  _updatePointMarker(point) {
    const m = this.points.get(point.id)

    const div = document.createElement('div')
    render(html`<em-marker-popup .point=${point}></em-marker-popup>`, div)

    m.setPopupContent(div)
  }

  _deletePointMarker(id) {
    const m = this.points.get(parseInt(id))
    m.remove()
    this.points.delete(parseInt(id))

    // TODO@mx deleted point feedback in UI
    console.log('deleted point', id)
  }

  async firstUpdated() {
    // map setup
    this.leafletMap = L.map(this.shadowRoot.querySelector('main'), {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [
        {
          text: 'create point',
          callback: async (evt) => {
            try {
              const newPoint = await api.post('/api/point', {
                mapId: this.mapId,
                point: { location: evt.latlng },
              })

              this.points.set(newPoint.id, this._createPointMarker(newPoint))
            } catch (err) {
              console.error(err)
            }
          },
        },
      ],
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      this.leafletMap,
    )

    // listeners
    this.addEventListener('em:point-delete', (evt) => {
      const { id } = evt.detail
      try {
        api.delete(`/api/point/${id}`)

        this._deletePointMarker(id)
      } catch (err) {
        console.error(err)
      }
    })

    this.addEventListener('em:point-update', async (evt) => {
      const point = evt.detail
      try {
        await api.put(`/api/point/${point.id}`, { point })
      } catch (err) {
        console.error(err)
      }
    })

    // io listeners
    io.on('point-create', (point) => {
      this.points.set(point.id, this._createPointMarker(point))
    })
    io.on('point-update', (point) => {
      this._updatePointMarker(point)
    })
    io.on(
      'point-delete',
      (id) => {
        this._deletePointMarker(id)
      },
      this,
    )

    // track mouse movement
    this.leafletMap.on('mousemove', (evt) =>
      this.userCursor.mouseMove(evt.latlng),
    )
  }

  render() {
    return html`
      <main></main>
    `
  }

  static styles = [
    unsafeCSS(leafletCss),
    unsafeCSS(leafletContextCss),
    css`
    :host {
      flex-grow: 1;
    }

    main {
      height: 100%;
      background: pink;
    }
  `,
  ]
}

window.customElements.define('map-view', MapView)
