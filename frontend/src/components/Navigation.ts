import { LitElement, html, css } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'

import MapIcon from '/icons/Map.svg'

import './UserTool'
import EventController from '../api/event'

@customElement('em-nav')
export class Navigation extends LitElement {
  eventController = new EventController(this)

  @property({ type: 'string' })
  mapName: string

  toggleDropdown() {
    this.eventController.dispatch('em:toggle-meta')
  }

  render() {
    return html`
      <button @click=${this.toggleDropdown}>
        <img src=${MapIcon}>
      </button>
      <span class="title">${this.mapName}</span>
      <user-tool></user-tool>
    `
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        padding-inline: 1em;
        padding-block: 0.75em 0.5em;
        gap: 1em;
        background: white;
      }

      button {
        display: inline-block;
        width: 2em;
        height: 2em;
        border: none;
        background: none;
        cursor: pointer;

        svg {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .title {
        font-size: 1.25em;
        font-weight: bold;
      }

      user-tool {
        margin-inline-start: auto;
      }
    `

  }
}
