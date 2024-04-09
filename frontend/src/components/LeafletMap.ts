import { unsafeCSS, LitElement, html, css } from 'lit'
import leafletCss from 'leaflet/dist/leaflet.css'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import L, { type Map as LeafletMap } from 'leaflet'
import 'leaflet-contextmenu'

import UserCursor from '../controllers/UserCursor'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('em-leaflet-map')
export class LeafletMapElement extends LitElement {
  // userCursor = new UserCursor(this)

  @property({ type: Array })
  contextMenu: Array<{text: string, callback(event: L.LeafletMouseEvent): void }> = []

  @property({ type: Boolean })
  controls: Boolean | undefined

  @property({ type: Array })
  bounds: Array<number> = []

  @state()
  leaflet: LeafletMap = {} as LeafletMap

  constructor() {
    super()
    this.controls = this.controls !== undefined
  }

  get slottedChildren() {
    const slot = this.shadowRoot?.querySelector('slot')
    return slot?.assignedElements()
  }

  firstUpdated() {
    // create leaflet map
    this.initMap()
  }

  initMap() {
    const mapEl = this.shadowRoot?.querySelector('main')

    if (mapEl) {
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
        this.leaflet.locate({ setView: true, maxZoom: 19 })

        this.leaflet.on('locationfound', (evt) => {
          this.leaflet.panTo(evt.latlng)
        })

        this.leaflet.on('locationerror', () => {
          console.error('location cannot be found')
        })
      }

      // track mouse movement
      // this.leaflet.on('mousemove', (evt) => this.userCursor.mouseMove(evt.latlng))
    }
  }

  handleSlotChange(evt: Event) {
    const childElements = evt.target?.assignedElements()
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

