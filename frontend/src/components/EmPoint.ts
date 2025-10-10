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

  @state()
  marker: Marker = L.marker(this.latlng)

  @state()
  added = false

  firstUpdated() {
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

  protected willUpdate(att: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {}

  disconnectedCallback(): void {
    super.disconnectedCallback()
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}
