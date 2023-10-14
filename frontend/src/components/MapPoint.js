import L from 'leaflet'
import { LitElement, html, render } from 'lit'

class MapPoint extends LitElement {
  static properties = {
    id: { type: Number },
    lonlat: { type: Array },
    leflet: { type: Object },

    marker: { state: true },
    popup: { state: true }
  }

  constructor() {
    super()
    this.id = {}
    this.latlon = []
  }

  firstUpdated() {
    this.marker = L.marker(this.latlon).addTo(this.leaflet)

    this.genPopup(this.slottedChildren)
  }

  get slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot')
    return slot.assignedElements()
  }

  genPopup(childNodes) {
    this.popup = L.popup()
    this.marker.bindPopup(this.popup)

    this.marker.on('popupopen', () => {
      const pp = this.popup.getElement()
      const inner = pp.querySelector('.leaflet-popup-content')

      render(childNodes, inner)
      this.popup.update()
    })
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('em-map-point', MapPoint)
