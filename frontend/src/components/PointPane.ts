import { LitElement, type PropertyValueMap, css, html } from 'lit'
import { live } from 'lit/directives/live.js'
import EventController from '../api/event.js'
import { customElement, property, state } from 'lit/decorators.js'
import type { Point } from '../interfaces/Point.js'

// state & effects
import { dispatch } from '@ngneat/effects'
import '../state/effects/map'
import '../state/effects/point'
import { deletePoint } from '../state/actions/point.js'

// TODO:
// - room per point per map to see who is currently looking at point
// - deleting point warns others
@customElement('em-point-pane')
export class PointPane extends LitElement {
  eventController = new EventController(this)

  @property({ type: Boolean })
  active: boolean

  @property({ type: Object })
  point: Point = {} as Point

  @state()
  meta: {
    createdBy: {
      name?: string
    },
    updatedBy: {
      name?: string
    }
  }

  @state()
  updatedDetails: {
    name?: string
    notes?: string
  }

  constructor() {
    super()
    this.meta = {
      updatedBy: {},
      createdBy: {},
    }

    this.updatedDetails = {}
  }

  firstUpdated() {
    const form = this.shadowRoot?.querySelector('form')
    form?.addEventListener('input', this.inputUpdate.bind(this))
  }

  private inputUpdate(evt) {
    const input = evt.target.getAttribute('name')
    this.updatedDetails[input] = evt.target.value

    this.eventController.dispatch('em:point-update', {
      detail: {
        id: this.point.id,
        ...this.updatedDetails
      }
    })
  }

  protected willUpdate(changedProperties: PropertyValueMap<this> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('point') && this.point) {
      this.meta.updatedBy = this.point.updatedBy.sess?.user ?? { name: '' }
      this.meta.createdBy = this.point.createdBy.sess?.user ?? { name: '' }
    }
  }

  private close() {
    this.eventController.dispatch('em:close-pane')
  }

  private delete() {
    const { id } = this.point
    dispatch(deletePoint({ id }))
    this.close()
  }

  render() {
    return html`
    <aside class=${this.active ? 'active' : ''}>
      <div class="controls">
        <button @click=${this.close}>close</button>
      </div>
      <p>${this.point?.id}</p>
      <form>
        <input type="text" name="name" .value=${live(this.point?.name)} placeholder="name">
        <textarea name="notes" .value=${live(this.point?.notes)} placeholder="notes"></textarea>
      </form>

      <div class="meta">
        <p>updated by : ${this.meta.updatedBy.name}</p>
        <p>created by : ${this.meta.createdBy.name}</p>
      </div>

      <div class="controls">
        <button class="delete" @click=${this.delete.bind(this)}>delete</button>
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

