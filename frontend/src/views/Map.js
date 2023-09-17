import { LitElement, html, css } from 'lit'
import io from '../api/socket.js'

// components
import '../components/LeafletMap.js'

// Stores
import { StoreController } from 'exome/lit'
import mapStore from '../store/mapStore.js'

class MapView extends LitElement {
  map = new StoreController(this, mapStore)

  static get properties() {
    return {
      name: { type: String },
      socket: { state: true },
      contextMenu: { type: Array }
    }
  }

  constructor() {
    super()
    this.name = ''
    this.contextMenu = [
      {
        text: 'create point',
        callback: async (evt) => {
          await this.map.store.createPoint({ location: evt.latlng })
          this.socket.emit('new-point', this.map.store.points)
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

    this.socket.on('new-point', this.map.store.setPoints)
  }

  render() {
    console.log(this.map.store.points)
    return html`
      <leaflet-map
        .points=${this.map.store.points}
        .contextMenu=${this.contextMenu}
      >
      </leaflet-map>
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
