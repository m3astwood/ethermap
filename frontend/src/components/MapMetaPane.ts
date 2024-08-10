import { LitElement, type PropertyValueMap, css, html } from 'lit'
import EventController from '../api/event.js'
import { customElement, property, state } from 'lit/decorators.js'

// state & effects
import '../state/effects/map'
import '../state/effects/point'

@customElement('em-map-pane')
export class PointPane extends LitElement {
  eventController = new EventController(this)

  firstUpdated() {}

  render() {
    return html`
    <aside>
      <slot></slot>
    </aside>`
  }

  static styles = css`

    :host {
      display: block;
      position: relative;
      overflow: hidden;
      max-width: 0;
      transition: max-width 0.125s ease-in-out;
    }

    :host([aria-expanded]) {
      max-width: 50vw;
    }

    aside {
      flex-direction: column;
      padding: 1em;
      top: 0;
      bottom: 0;
      left: 0;
      width: 20vw;
      background-color: white;
      height: 100%;
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

