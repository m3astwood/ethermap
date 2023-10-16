import L from 'leaflet'
import { LitElement, html, render } from 'lit'

class MapPoint extends LitElement {
  static properties = {
    id: { type: Number },
    lonlat: { type: Array },
    leaflet: { type: Object },

    marker: { state: true },
    popup: { state: true },
    slotted: { state: true }
  }

  constructor() {
    super()
    this.id = {}
    this.latlon = []
    this.slotted = []
  }

  firstUpdated() {
    this.genPopup(this.slottedChildren)
  }

  willUpdate(att) {
    if (att.has('leaflet') && this.latlon) {
      this.marker = L.marker(this.latlon).addTo(this.leaflet)
    }
  }

  get slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot')
    return slot.assignedElements()
  }

  genPopup(childNodes) {
    this.popup = L.popup()
    this.marker.bindPopup(this.popup)

    this.marker.on('popupopen', async () => {
      const pp = this.popup.getElement()
      const inner = pp.querySelector('.leaflet-popup-content')

      // load MarkerPopup element
      const hasPopup = childNodes.findIndex(n => n.tagName == 'EM-MARKER-POPUP') >= 0
      if (hasPopup) {
        await import('./MarkerPopup.js')
      }

      render(childNodes, inner)
      this.popup.update()
    })
  }

  render() {
    return html`
      <slot @slotchange=${this.handleSlotChange}></slot>
    `
  }
}

customElements.define('em-map-point', MapPoint)
