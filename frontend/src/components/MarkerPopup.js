import { LitElement, html, css } from 'lit'
import { live } from 'lit/directives/live.js'

// Stores
import { StoreController } from 'exome/lit'
import mapStore from '../store/mapStore.js'

// Controllers
import EventController from '../api/event.js'

class MarkerPopup extends LitElement {
  map = new StoreController(this, mapStore)
  eventController = new EventController(this)

  static get properties() {
    return {
      // props
      id: { type: Number },
      point: { type: Object },
      marker: { type: Object },

      // internal state
      elWidth: { state: true }
    }
  }

  constructor() {
    super()
    this.point = {
      id: '',
      name: '',
      notes: ''
    }

    this.id = 0
  }

  deleteHandler() {
    this.marker.remove()
    this.eventController.dispatch('em:point-delete', { detail: { id: this.id } })
  }

  updateHandler() {
    this.marker.closePopup()
    this.eventController.dispatch('em:point-update', { detail: { ...this.point } })
  }

  render() {
    return html`
      <div>id : ${this.id}</div>
      <input
        type="text"
        name="name"
        .value=${live(this.point.name)}
        placeholder="name"
        @input=${e => this.point.name = e.target.value}
      >
      </input>

      <textarea
        name="notes"
        placeholder="notes"
        .value=${live(this.point.notes)}
        @input=${e => this.point.notes = e.target.value}
      ></textarea>

      <div class="controls">
        <button name="delete" @click=${this.deleteHandler}>delete</button>
        <button name="save" @click=${this.updateHandler}>save</button>
      </div>
    `
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-flow: row;
        gap: 0.25em;
      }

      input, textarea {
        display: block;
        box-sizing: border-box;
        width: 100%:
      }

      .controls {
        display: flex;

      }

      button:last-child {
        margin-inline-start: auto;
      }
    `
  }
}

window.customElements.define('em-marker-popup', MarkerPopup)
