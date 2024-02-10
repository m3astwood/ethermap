import { unsafeCSS, LitElement, html, css } from 'lit'
import leafletCss from 'leaflet/dist/leaflet.css'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import * as L from 'leaflet'
import 'leaflet-contextmenu'

import UserCursor from '../controllers/UserCursor'

class LeafletMap extends LitElement {
  userCursor = new UserCursor(this)

  static get properties() {
    return {
      // props
      contextMenu: { type: Array },
      controls: { type: Boolean },
      bounds: { type: Array },

      // state
      leaflet: { state: true },
    }
  }

  constructor() {
    super()
    this.leaflet = {}
    this.contextMenu = []
    this.controls = this.controls == undefined ? false : true
    this.bounds = []
  }

  get slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot')
    return slot.assignedElements()
  }

  firstUpdated() {
    // create leaflet map
    const mapEl = this.shadowRoot.querySelector('main')

    this.leaflet = L.map(mapEl, {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: this.contextMenu,
    }).setView([51.8919, 4.4692], 19)

    // set map tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.leaflet)

    if (!this.controls) {
      this.leaflet.locate({ setview: true, maxZoom: 19 })

      this.leaflet.on('locationfound', (evt) => {
        this.leaflet.panTo(evt.latlng)
      })

      this.leaflet.on('locationerror', () => {
        console.error('location cannot be found')
      })
    }

    // track mouse movement
    this.leaflet.on('mousemove', (evt) => this.userCursor.mouseMove(evt.latlng))
  }

  handleSlotChange(evt) {
    const childElements = evt.target.assignedElements()
    childElements.forEach((p) => {
      p.leaflet = this.leaflet
    })
  }

  render() {
    return html`
      <main>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </main>
    `
  }

  static get styles() {
    return [
      unsafeCSS(leafletCss),
      unsafeCSS(leafletContextCss),
      css`
      :host {
        flex-grow: 1;
      }
      main {
        height: 100%;
      }
      .leaflet-popup-content {
        margin: 8px;
      }
    `,
    ]
  }
}

window.customElements.define('em-leaflet-map', LeafletMap)
