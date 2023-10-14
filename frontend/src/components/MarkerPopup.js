import { LitElement, html, css } from 'lit'
import { live } from 'lit/directives/live.js'

class MarkerPopup extends LitElement {
  static get properties() {
    return {
      id: { type: Number },
      point: { type: Object },

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

  render() {
    return html`
      <div>id : ${this.id}</div>
      <input
        type="text"
        name="name"
        value=${live(this.point.name)}
        placeholder="name"
        @input=${e => this.point.name = e.target.value}
      >
      </input>
      <textarea
        name="notes"
        placeholder="notes"
        value=${live(this.point.notes)}
        @input=${e => this.point.notes = e.target.value}
      ></textarea>
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
    `
  }
}

window.customElements.define('em-marker-popup', MarkerPopup)
