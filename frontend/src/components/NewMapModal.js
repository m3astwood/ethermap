import { LitElement, html, css } from 'lit'
import Router from '../controllers/Router'

class NewMapModal extends LitElement {
  static get properties() {
    return {
      mapName: { state: true }
    }
  }

  constructor() {
    super()
    this.mapName = ''
  }

  navigate(evt) {
    evt.preventDefault()
    Router.navigate(`/m/${this.mapName}`)
  }

  render() {
    return html`
    <main>
      <div class="window">
        <form>
          <label for="name">map name</label>
          <input type="text" name="name" @input=${e => this.mapName = e.target.value}></input>
          <div class="controls">
            <button @click=${this.navigate}>go</button>
          </div>
        </form>
      </div>
    </main>`
  }

  static get styles() {
    return css`
      main {
        position: absolute;
        inset: 0;
        display: grid;
        align-content: center;
        justify-items: center;
        background: #33333350;
        z-index: 1000;
      }

      .window {
        background: white;
        padding: 1em;
        border: thick solid black;
      }

      .controls {
        display: flex;
        justify-content: end;
      }

      button {
        min-width: 5ch;
      }

      form {
        display: grid;
        grid-auto-flow: rows;
        gap: 0.25em;
      }
    `
  }
}

window.customElements.define('newmap-modal', NewMapModal)
