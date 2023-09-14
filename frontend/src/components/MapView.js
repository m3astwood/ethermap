import { unsafeCSS, LitElement, html, css } from 'lit'
import leafletCss from 'leaflet/dist/leaflet.css?inline'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css?inline'
import * as L from 'leaflet'
import 'leaflet-contextmenu'

import { io } from 'socket.io-client'

import MapController from '../controllers/MapController'

class MapView extends LitElement {
  mapController = new MapController(this)

  static get properties() {
    return {
      name: { type: String },
      map: { state: true },
      points: { type: Array, state: true },
      leaflet: { state: true },
      socket: { state: true },
      users: { state: true }
    }
  }

  constructor() {
    super()
    this.name = ''
    this.leaflet = {}
    this.points = []
    this.users = []
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
      // TODO@me check whether user is in view before rendering
      // TODO@me restrict rendering within range of zoom-level
      const { id, pos } = data

      // if user is not created, then do so
      if (!this.users[id]) {
        const cursorIcon = L.icon({ iconUrl: '/icons/cursor.svg', iconSize: [ 20, 30 ], iconAnchor: [ 0, 8 ], className: 'user-cursor' })
         this.users[id] = L.marker([ pos.lat, pos.lng ], { icon: cursorIcon, interactive: false, zIndexOffset: 1000 }).addTo(this.leaflet)
      }

      // update cursor's position
      this.users[id].setLatLng([ pos.lat, pos.lng ])
    })

    // get the map with name
    // TODO@me only run this if we are at the path /m/:mapName
    this.mapController.get(this.name).then(m => {
      if (m?.id) {
        this.socket.emit('connect-map', m.id)
      }

      // set points
      if (m?.map_points.length > 0) {
        this.setPoints(m.map_points)
      }
    })
  }

  setPoints(points) {
    console.log(points)
    points.forEach((p, i) => {
      this.points[i] = L.marker([ p.location.x, p.location.y ]).addTo(this.leaflet)
      this.points[i].bindPopup(`<h3>${p.name}</h3>${p.notes ? `<p>${p.notes}</p>` : ''}`)
    })


    const end = points.length - 1
    this.leaflet.setView([ points[end].location.x, points[end].location.y ], 13)
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
