import L, { LeafletMouseEvent, Map, Marker, Popup } from 'leaflet'
import { LitElement, html } from 'lit'
import EventController from '../api/event'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('em-point')
export class Point extends LitElement {
  event = new EventController(this)

  @property({ type: Number })
  id: number

  @property({ type: Number })
  latlng: { lat: number, lng: number } = { lat: 0, lng: 0 }

  @property({ type: Object })
  leaflet: Map

  @state()
  marker: Marker = L.marker(this.latlng)

  @state()
  popup: Popup

  @state()
  slotted: Array<HTMLElement> = []

  firstUpdated() {
    this.marker.addEventListener('click', (event: LeafletMouseEvent) => {
      this.event.dispatch('click', { detail: { ...event, id: this.id } })
    })
  }

  willUpdate(att: Set<string>) {
    if (att.has('leaflet')) {
      this.marker.setLatLng(this.latlng).addTo(this.leaflet)
    }
  }

  disconnectedCallback() {
    this.marker.remove()
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
