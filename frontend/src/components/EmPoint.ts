import L, { type LeafletMouseEvent, type Map as LMap, type Marker, type Popup } from 'leaflet'
import { LitElement, type PropertyValueMap, html } from 'lit'
import EventController from '../api/event'
import { customElement, property, state } from 'lit/decorators.js'
import { dispatch } from '@ngneat/effects'
import { deletePoint } from '../state/actions/point'

@customElement('em-point')
export class EtherPoint extends LitElement {
  event = new EventController(this)

  @property({ type: String })
  id: string

  @property({ type: Number })
  latlng: { lat: number, lng: number } = { lat: 0, lng: 0 }

  @property({ type: Object })
  leaflet: LMap

  @state()
  marker: Marker = L.marker(this.latlng)

  @state()
  added = false

  firstUpdated() {
    this.marker.addEventListener('click', (event: LeafletMouseEvent) => {
      this.event.dispatch('click', { detail: { ...event, id: this.id } })
    })

    this.marker.bindContextMenu({
      contextMenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: [
        {
          text: 'delete point',
          callback: () => {
            dispatch(deletePoint({ id: Number.parseInt(this.id) }))
          },
        },
      ]
    })
  }

  protected willUpdate(att: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (att.has('leaflet')) {
      this.marker.setLatLng(this.latlng).addTo(this.leaflet)
      this.added = true
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.marker.removeFrom(this.leaflet)
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}
