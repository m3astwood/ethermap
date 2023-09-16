import { unsafeCSS, LitElement, html, css } from 'lit'
import leafletCss from 'leaflet/dist/leaflet.css?inline'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css?inline'
import * as L from 'leaflet'
import 'leaflet-contextmenu'

import { io } from 'socket.io-client'
// HACK this needs to be finessed
import SvgCursor from './SvgCursor.js'

import MapController from '../controllers/MapController'
import PointController from '../controllers/PointController.js'

class MapView extends LitElement {
  mapController = new MapController(this)
  pointController = new PointController(this)

  static get properties() {
    return {
      name: { type: String },
      map: { state: true },
      leaflet: { state: true },
      socket: { state: true },
      users: { state: true }
    }
  }

  constructor() {
    super()
    this.name = ''
    this.leaflet = {}
    this.users = {}
  }

  firstUpdated() {
    // connect to socket
    this.socket = io()

    // create leaflet map
    const mapEl = this.shadowRoot.querySelector('main')
    this.leaflet = L.map(mapEl, {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [ {
        text: 'create point',
        callback: (evt) => {
          const event = new CustomEvent('open-modal', {
            bubbles: true, composed: true,
            detail: { mapId: this.mapController.map.id, latlng: evt.latlng }
          })

          this.dispatchEvent(event)
        }
      } ]
    }).setView([ 51.89190, 4.46920 ], 19)

    // set map tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.leaflet)


    // track mouse movement
    this.leaflet.on('mousemove', (evt) => {
      this.socket.emit('mousemove', evt.latlng)
    })

    // track other users
    this.socket.on('mousemove', (data) => {
      // TODO@suroh check whether user is in view before rendering
      // TODO@suroh restrict rendering within range of zoom-level
      const { user, pos } = data

      // if user is not created, then do so
      if (!this.users[user.id]) {
        const cursorIcon = L.divIcon({ html: SvgCursor(user.colour), iconSize: [ 20, 30 ], iconAnchor: [ 0, 8 ], className: 'user-cursor' })
        this.users[user.id] = L.marker([ pos.lat, pos.lng ], { icon: cursorIcon, interactive: false, zIndexOffset: 1000 }).addTo(this.leaflet)
      }

      // update cursor's position
      this.users[user.id].setLatLng([ pos.lat, pos.lng ])
    })

    this.socket.on('user-disconnected', (id) => {
      this.users[id].remove()
      delete this.users[id]
    })

    // get the map with name
    // TODO@suroh only run this if we are at the path /m/:mapName
    this.mapController.get(this.name).then(data => {
      const { map } = data

      if (map?.id) {
        this.socket.emit('connect-map', map.id)
      }

      // set points
      if (map?.map_points.length > 0) {
        this.pointController.list = map.map_points
        this.pointController.list.forEach(this.setPoint, this)

        const end = this.pointController.list.length - 1
        this.leaflet.setView([ this.pointController.list[end].location.x, this.pointController.list[end].location.y ])
      }
    })
  }

  setPoint(point, index) {
    index = index ?? this.pointController.list.length - 1
    this.pointController.list[index].marker = L.marker([ point.location.x, point.location.y ]).addTo(this.leaflet)
    this.pointController.list[index].marker.bindPopup(`<h3>${point.name}</h3>${point.notes ? `<p>${point.notes}</p>` : ''}`)
  }

  render() {
    return html`<main></main>`
  }

  static get styles() {
    return [ unsafeCSS(leafletCss), unsafeCSS(leafletContextCss), css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      main {
        flex-grow: 1;
      }
    ` ]
  }
}

window.customElements.define('map-view', MapView)
