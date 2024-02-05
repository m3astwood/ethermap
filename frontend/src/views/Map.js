import { LitElement, html, css } from 'lit'
import io from '../api/socket.js'

// components
import '../components/LeafletMap.js'
import '../components/EmPoint.js'
import '../components/PointPopup.js'

// Stores
import { StoreController } from 'exome/lit'
import mapStore from '../store/mapStore.js'

class MapView extends LitElement {
  map = new StoreController(this, mapStore)

  static get properties() {
    return {
      // props
      name: { type: String },
      contextMenu: { type: Array },

      // internal state
      socket: { state: true },
    }
  }

  constructor() {
    super()
    this.name = ''
    this.contextMenu = [
      {
        text: 'create point',
        callback: async (evt) => {
          try {
            const point = await this.map.store.createPoint({ location: evt.latlng })
            this.socket.emit('point-create', point)
          } catch (err) {
            console.error(err)
          }
        }
      }
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    // connect to socket
    this.socket = io
  }

  async firstUpdated() {
    // load map
    await this.map.store.get(this.name)

    // connect to socket room
    this.socket.emit('connect-map', this.map.store.data.id)

    // point actions
    this.socket.on('point-create', this.map.store.socketUpdatePoint)
    this.socket.on('point-update', this.map.store.socketUpdatePoint)
    this.socket.on('point-delete', this.map.store.socketUpdatePoint)

    this.addEventListener('em:point-update', ({ detail }) => {
      this.map.store.updatePoint(detail)
    })

    this.addEventListener('em:point-delete', ({ detail }) => {
      this.map.store.deletePoint(detail.id)
      this.socket.emit('point-delete', detail.id)
    })
  }

  render() {
    return html`
      <!-- map -->
      <em-leaflet-map .contextMenu=${this.contextMenu} controls>

        <!-- points -->
        ${this.map.store.points.map(point => html`
          <em-point id=${point.id} .latlng=${[point.location.x, point.location.y]}>
            <em-marker-popup id=${point.id} .point=${point}></em-marker-popup>
          </em-point>
        `)}

      </em-leaflet-map>
    `
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    `
  }
}

window.customElements.define('map-view', MapView)
