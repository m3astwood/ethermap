import { LitElement, css, html } from 'lit'
import { live } from 'lit/directives/live.js'
import EventController from '../api/event.js'

// TODO@mx
// - room per point per map to see who is currently looking at point
// - deleting point warns other's

class PointPane extends LitElement {
  eventController = new EventController(this)

  static properties = {
    active: { type: Boolean },
    point: { type: Object },
    meta: { type: Object }
  }

  constructor() {
    super()
    this.point = {}
    this.meta = {
      updated_by: {},
      created_by: {}
    }
  }

  firstUpdated() {
    const form = this.shadowRoot.querySelector('form')
    form.addEventListener('input', this._inputUpdate.bind(this))
  }

  _inputUpdate(evt) {
    const input = evt.target.getAttribute('name')
    this.point[input] = evt.target.value

    this.eventController.dispatch('em:point-update', { detail: this.point })
  }

  _close() {
    this.eventController.dispatch('em:close-pane')
  }

  _delete() {
    const { id } = this.point
    this.eventController.dispatch('em:point-delete', { detail: { id } } )
  }

  render() {
    return html`
    <aside class=${this.active ? 'active' : ''}>
      <div class="controls">
        <button @click=${this._close}>close</button>
      </div>
      <form>
        <input type="text" name="name" .value=${live(this.point?.name)} placeholder="name">
        <textarea name="notes" .value=${live(this.point?.notes)} placeholder="notes"></textarea>
      </form>

      <div class="controls">
        <button class="delete" @click=${this._delete.bind(this)}>delete</button>
      </div>
    </aside>`
  }

  static styles = css`

    aside {
      position: absolute;
      display: flex;
      flex-direction: column;
      padding: 1em;
      top: 0;
      bottom: 0;
      right: 0;
      width: 20vw;
      background-color: white;
      z-index: 10000;
      transform: translateX(100%);
    }

    aside.active {
      transform: translateX(0);
    }

    form {
      padding-block: 0.5em;
      display: grid;
      grid-auto-flow: row;
      gap: 0.5em;
    }

    input, textarea {
      font-family: inherit;
      font-size: 1.25em;
    }

    textarea {
      min-height: 120px;
    }

    .controls {
      display: flex;
      justify-content: flex-end;
      gap: 0.5em;
    }

    .controls:last-of-type {
      margin-block-start: auto;
    }
  `
}

customElements.define('em-point-pane', PointPane)
