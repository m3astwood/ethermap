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
import '../components/PointPane.js'

class MapView extends LitElement {
  userCursor = new UserCursor(this)

  static properties = {
    map: { type: Object },
    mapId: { state: true },
    leafletMap: { state: true },
    points: { state: true },
    selectedPoint: { state: true }
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

    m.properties = point

    m.addEventListener('click', () => {
      this.selectedPoint = this.points.get(point.id).properties
      console.log(this.points.get(point.id))
    })

    return m
  }

  _updatePointMarker(point) {
    const p = this.points.get(point.id)
    p.properties = point

    if (this.selectedPoint?.id == point.id) {
      this.selectedPoint = p.properties
    }
  }

  _deletePointMarker(id) {
    const m = this.points.get(parseInt(id))
    m.remove()
    this.points.delete(parseInt(id))

    this.selectedPoint = null

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
              this.selectedPoint = this.points.get(newPoint.id).properties
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
      console.log('delete', id)
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
        io.emit('client-point-update', point)
      } catch (err) {
        console.error(err)
      }
    })

    this.addEventListener('em:close-pane', () => this.selectedPoint = null)

    // io listeners
    io.on('point-create', (point) => {
      this.points.set(point.id, this._createPointMarker(point))

    })
    io.on('point-update', this._updatePointMarker.bind(this))
    io.on('point-delete', this._deletePointMarker.bind(this))

    // track mouse movement
    this.leafletMap.on('mousemove', (evt) =>
      this.userCursor.mouseMove(evt.latlng),
    )
  }

  render() {
    return html`
      <main>
        <em-point-pane ?active=${this.selectedPoint} .point=${this.selectedPoint}></em-point-pane>
      </main>
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
