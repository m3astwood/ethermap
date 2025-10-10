import { unsafeCSS, LitElement, html, css } from 'lit'
import maplibre, { GeolocateControl, Map, Marker, NavigationControl, Popup } from 'maplibre-gl'
import maplibreCss from 'maplibre-gl/dist/maplibre-gl.css?inline'

import type { EtherPoint } from './EmPoint'

// import UserCursor from '../controllers/UserCursor'
import { customElement, property, state } from 'lit/decorators.js'

import { devTools } from '@ngneat/elf-devtools'
import { ContextMenu } from './EmContextMenu'

@customElement('em-map')
export class EmMapElement extends LitElement {
  // userCursor = new UserCursor(this)

  @property({ type: Boolean })
  controls: boolean | undefined

  @property({ type: Array })
  bounds: number[] = []

  @state()
  map: Map

  constructor() {
    super()
    this.controls = this.controls !== undefined

    devTools();
  }

  firstUpdated() {
    // create map
    this.initMap()
  }

  initMap() {
    const mapEl = this.shadowRoot?.querySelector('main')

    if (mapEl) {

      this.map = new Map({
        container: mapEl,
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [0, 0],
        zoom: 2,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false,
        touchPitch: false,
        doubleClickZoom: false,
      })

      const contextMenu = new ContextMenu(this.map, {
        entries: [
          {
            label: 'test',
            event: 'em:test'
          }
        ]
      })

      window.addEventListener('em:test', ({ detail }) => {
        console.log(detail)
      })

      if (this.controls) {
        this.map.addControl(new NavigationControl({
          showZoom: true,
          showCompass: false,
        }))

        this.map.addControl(new GeolocateControl({
          fitBoundsOptions: {
            animate: true,
          },
          showUserLocation: true,
        }))
      }
    }
  }

  handleSlotChange(evt: Event) {
    const childElements = (evt.target as HTMLSlotElement)?.assignedElements()
    for (const point of childElements) {}
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
      unsafeCSS(maplibreCss),
      css`
      :host {
        flex-grow: 1;
      }
      main {
        height: 100%;
      }
    `,
    ]
  }
}
