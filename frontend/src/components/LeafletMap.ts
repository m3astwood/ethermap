import L, { type Map as LeafletMap } from 'leaflet'
import leafletCss from 'leaflet/dist/leaflet.css?inline'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css?inline'
import { css, html, LitElement, unsafeCSS } from 'lit'
import 'leaflet-contextmenu'

import { devTools } from '@ngneat/elf-devtools'

// import UserCursor from '../controllers/UserCursor'
import { customElement, property, state } from 'lit/decorators.js'
import EventController from '../api/event'
import type { EtherPoint } from './EmPoint'

@customElement('em-leaflet-map')
export class LeafletMapElement extends LitElement {
  // userCursor = new UserCursor(this)
  eventController = new EventController(this)

  @property({ type: Array })
  contextMenu: Array<{ text: string; callback(event: L.LeafletMouseEvent): void }> = []

  @property({ type: Boolean })
  controls: boolean | undefined

  @property({ type: Array })
  bounds: number[] = []

  @state()
  leaflet: LeafletMap = {} as LeafletMap

  constructor() {
    super()
    this.controls = this.controls !== undefined

    devTools()
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
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

      this.leaflet.on('moveend', (evt) => {
        // console.log('MOVEND :', evt)
        this.eventController.dispatch('em:viewport-changed', {
          detail: { zoom: evt.target._zoom, location: evt.target._lastCenter },
        })
      })

      // track mouse movement
      // this.leaflet.on('mousemove', (evt) => this.userCursor.mouseMove(evt.latlng))
    }
  }

  handleSlotChange(evt: Event) {
    const childElements = (evt.target as HTMLSlotElement)?.assignedElements()
    for (const point of childElements) {
      // @ts-expect-error
      if (!point.leaflet) {
        ;(point as unknown as EtherPoint).leaflet = this.leaflet
      }
    }
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
