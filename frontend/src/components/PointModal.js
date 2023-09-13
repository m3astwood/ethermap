import { LitElement, html, css } from 'lit'
import { live } from 'lit/directives/live.js'
import PointController from '../controllers/PointController.js'

class PointModal extends LitElement {

  pointController = new PointController(this)

  static get properties() {
    return {
      latlng: { type: Object },
      mapId: { type: Number, state: true },
      id: { type: Number },
      name: { type: String },
      notes: { type: String },
      modalEl: { state: true }
    }
  }

  constructor() {
    super()
    this.id = ''
    this.mapId = ''
    this.name = ''
    this.notes = ''
    this.latlng = {}
    this.modalEl = {}
  }

  firstUpdated() {
    this.modalEl = this.shadowRoot.querySelector('dialog')
  }

  open(mapId, latlng) {
    this.mapId = mapId
    console.log(mapId)
    this.latlng = { ...latlng }
    this.name = ''
    this.notes = ''
    this.modalEl.showModal()
  }

  close(evt) {
    evt.preventDefault()
    this.modalEl.close()
  }

  save(evt) {
    evt.preventDefault()
    console.log(this.mapId)
    PointController.savePoint(this.mapId, { name: this.name, notes: this.notes, location: this.latlng })
    // TODO@me validate form entry
    // TODO@me check if successful
    this.close(evt)
  }

  render() {
    return html`
    <dialog>
      <h2>create new point</h2>
      <p>${this.latlng.lat}, ${this.latlng.lng}</p>
      <form>
        <label name="name" for="name">name</label>
        <input name="name" type="text" .value=${live(this.name)} @input=${e => this.name = e.target.value}>

        <label name="notes" for="notes">notes</label>
        <textarea name="notes" .value=${live(this.notes)} @input=${e => this.notes = e.target.value}></textarea>

        <div class="controls">
          <button @click=${this.close}>cancel</button> <button @click=${this.save}>save</button>
        </div>
      </form>
    </dialog>
    `
  }

  static get styles() {
    return css`
      form {
        display: grid;
        grid-auto-flow: rows;
      }

      .controls {
        display: flex;
      }

      .controls > :first-child {
        margin-inline-start: auto;
        margin-inline-end: 0.25em;
      }

      label, .controls {
        margin-block-start: 0.25em;
      }

      h2 {
        margin-block: 0.125em;
      }
    `
  }
}

window.customElements.define('point-modal', PointModal)
