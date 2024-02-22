import { LitElement, html, css, unsafeCSS, render } from 'lit'

import io from '../api/socket.js'

import { api } from '@thepassle/app-tools/api.js'
import { Task } from '@lit/task'

import L from 'leaflet'
import 'leaflet-contextmenu'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import leafletCss from 'leaflet/dist/leaflet.css'

import '../components/PointPopup.js'

class MapView extends LitElement {
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

      for (const point of m.points) {
        this.points.set(point.id, this._createPointMarker(point))
      }
    },
    args: () => [this.map],
  })

  _createPointMarker(point) {
    const m = L.marker(point.location).addTo(
      this.leafletMap,
    )

    const div = document.createElement('div')
    render(html`<em-marker-popup .point=${point}></em-marker-popup>`, div)

    m.bindPopup(div)

    return m
  }

  _updatePointMarker(point) {
    const m = this.points.get(point.id)

    console.log(m)
    const div = document.createElement('div')
    render(html`<em-marker-popup .point=${point}></em-marker-popup>`, div)

    m.setPopupContent(div)
  }

  _deletePointMarker(id) {
    const m = this.points.get(parseInt(id))
    m.remove()
    this.points.delete(parseInt(id))

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
    }).setView([51.8919, 4.4692], 19)

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
        console.log(point)
        const updPoint = await api.put(`/api/point/${point.id}`, { point })

        console.log(updPoint)
      } catch (err) {

      }
    })

    // io listeners
    io.on('point-create', (point) => {
      this.points.set(
        point.id,
        this._createPointMarker(point)
      )
    })
    io.on('point-update', (point) => {
      this._updatePointMarker(point)
    })
    io.on('point-delete', (id) => {
      this._deletePointMarker(id)
    }, this)
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
