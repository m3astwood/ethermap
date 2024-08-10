import L from 'leaflet'
import { LitElement, html } from 'lit'

class Point extends LitElement {
  static properties = {
    id: { type: Number },
    lonlat: { type: Array },
    leaflet: { type: Object },

    marker: { state: true },
    popup: { state: true },
    slotted: { state: true },
  }

  constructor() {
    super()
    this.id = {}
    this.latlng = []
    this.slotted = []
    this.marker = L.marker()
  }

  willUpdate(att) {
    if (att.has('leaflet') && this.latlng) {
      this.marker.setLatLng(this.latlng).addTo(this.leaflet)
    }
  }

  disconnectedCallback() {
    this.marker.remove()
    super.disconnectedCallback()
  }

  handleSlotChange(evt) {
    const childElements = evt.target.assignedElements()

    if (this.marker) {
      for (let el of childElements) {
        this.popup = L.popup()
        this.marker.bindPopup(this.popup)

        if (el.tagName == 'EM-MARKER-POPUP') {
          el.marker = this.marker
        }

        this.popup.setContent(el)
        el.remove()
      }
    }
  }

  render() {
    return html`
      <slot @slotchange=${this.handleSlotChange}></slot>
    `
  }
}

customElements.define('em-point', Point)
