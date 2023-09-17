import { unsafeCSS, LitElement, html, css } from 'lit'
import leafletCss from 'leaflet/dist/leaflet.css?inline'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css?inline'
import * as L from 'leaflet'
import 'leaflet-contextmenu'

import UserCursor from '../controllers/UserCursor'

import '../components/MarkerPopup.js'

class LeafletMap extends LitElement {
  userCursor = new UserCursor(this)

  static get properties() {
    return {
      leaflet: { state: true },
      markers: { state: true },
      points: { type: Array },
      contextMenu: { type: Array },
    }
  }

  constructor() {
    super()
    this.leaflet = {}
    this.points = []
    this.contextMenu = []
    this.markers = []
  }

  // FIX@suroh this is not working perfectly
  set points(array) {
    array.forEach(this.setPoints, this)
  }

  firstUpdated() {
    // create leaflet map
    const mapEl = this.shadowRoot.querySelector('main')

    this.leaflet = L.map(mapEl, {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: this.contextMenu,
    }).setView([ 51.89190, 4.46920 ], 19)

    // set map tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.leaflet)

    // track mouse movement
    this.leaflet.on('mousemove', (evt) => this.userCursor.mouseMove(evt.latlng))

  }

  // TODO@suroh not taking values passed to attributes or properties
  setPoints(point, idx) {
    const pp = L.popup().setContent(`<marker-popup id=${idx} .point=${point}></marker-popup>`)
    L.marker([ point.location.x, point.location.y ])
      .bindPopup(pp)
      .addTo(this.leaflet)
  }

  setBounds() {
    // zoom map to see all markers
    const markerGroup = new L.featureGroup(this.points)
    this.leaflet.fitBounds(markerGroup.getBounds())
  }

  render() {
    return html`
      <main></main>
    `
  }

  static get styles() {
    return [unsafeCSS(leafletCss), unsafeCSS(leafletContextCss), css`
      :host {
        flex-grow: 1;
      }
      main {
        height: 100%;
      }
    `]
  }
}

window.customElements.define('leaflet-map', LeafletMap)
