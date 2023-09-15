import AccountIcon from '../../public/icons/AccountUserPersonSquare.svg'
import { LitElement, html, css } from "lit"
import { live } from 'lit/directives/live.js'
import UserController from '../controllers/UserController'

class UserTool extends LitElement {
  static get properties() {
    return {
      user: { type: Object }
    }
  }

  constructor() {
    super()
    this.user = {}
  }

  toggleDropdown() {
    const dropdownEl = this.shadowRoot.querySelector('.dropdown')
    dropdownEl.classList.toggle('active')
  }

  render() {
    return html`
      <button @click=${this.toggleDropdown}>
        <img src=${AccountIcon}>
      </button>

      <div class="dropdown">
        <input name="name" placeholder="name" value=${live(this.user?.name)} @change=${async e => await UserController.updateSettings(e)}></input>
        <input name="colour" type="color" value=${live(this.user?.colour)} @change=${async e => await UserController.updateSettings(e)}></input>
      </div>
    `
  }

  static get styles() {
    return css`
    button {
      background: none;
      border: none;
      padding: 0em;
      cursor: pointer;
    }

    button > img {
      display: block;
      height: 2.5em;
      aspect-ratio: 1/1;
    }

    .dropdown {
      --padding: 0.25em;
      display: none;
      position: absolute;
      right: 1em;
      top: 3em;
      max-width: 12em;
      background: white;
      padding: var(--padding);
      outline: thin solid black;
      z-index: 100000;
    }

    .dropdown > input {
      width: calc(100% - calc(var(--padding) * 2));
    }

    .dropdown.active {
      display: grid;
      grid-auto-flow: rows;
      gap: 0.25em;
    }
    `
  }
}

window.customElements.define('user-tool', UserTool)
