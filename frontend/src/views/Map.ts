import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { fromEvent, tap, debounceTime } from 'rxjs'

import io from '../api/socket'

import type { LeafletMouseEvent } from 'leaflet'
import 'leaflet-contextmenu'
import 'leaflet/dist/leaflet.css'

// import UserCursor from '../controllers/UserCursor'
import ObserveCtrl from '../controllers/Observable'
import '../components/Navigation'
import '../components/EmPoint'
import '../components/MapMetaPane'
import '../components/PointPane'
import { loadMap } from '../state/actions/map'
import { createPoint, createPointSuccess, deletePointSuccess, selectPoint, updatePoint, updatePointSuccess } from '../state/actions/point'

// state & effects
import { select } from '@ngneat/elf'
import { dispatch } from '@ngneat/effects'
import type { Observable } from 'rxjs'
import { mapState } from '../state/store/mapState'
import '../state/effects/map'
import '../state/effects/point'

// interfaces
import type MapModel from '../../../backend/db/models/map'
import { selectAllEntities } from '@ngneat/elf-entities'
import EventController from '../api/event'
import { LeafletMapElement } from '../components/LeafletMap'
import { Point } from '../interfaces/Point'

@customElement('map-view')
export class MapView extends LitElement {
  // controllers
  // userCursor = new UserCursor(this)
  points = new ObserveCtrl(this, mapState.pipe(selectAllEntities()))
  selectedPoint = new ObserveCtrl(this, mapState.pipe(select(state => state.selectedPoint)))
  eventController = new EventController(this)

  @property({ type: String })
  mapName = ''

  @state()
  private mapId: number

  @state()
  private contextMenu: Array<{ text: string, callback(event: LeafletMouseEvent): void }>

  @state()
  private map$: Observable<MapModel>

  @state()
  private showMeta = false

  @state()
  private eventSource: EventSource

  @state()
  private leafletMap: LeafletMapElement

  constructor() {
    super()

    this.map$ = mapState.pipe(select((state) => state.map))

    this.contextMenu = [
      {
        text: 'create point',
        callback: (evt: LeafletMouseEvent) => {
          dispatch(createPoint({ mapId: this.mapId, point: { location: evt.latlng } }))
        },
      },
    ]
  }

  async firstUpdated() {
    this.leafletMap = this.shadowRoot?.querySelector('em-leaflet-map')

    this.map$.subscribe((map) => {
      this.mapId = map.id

      if (this.mapId) {
        this.eventSource = new EventSource(`/api/events/map/${this.mapId}`)

        this.eventSource.addEventListener('point-create', ({ data }) => {
          const point = JSON.parse(data)
          dispatch(createPointSuccess({ point }))
        })
        this.eventSource.addEventListener('point-update', ({ data }) => {
          const point = JSON.parse(data)
          dispatch(updatePointSuccess({ point }))
        })
        this.eventSource.addEventListener('point-delete', ({ data }) => {
          const { id } = JSON.parse(data)
          dispatch(deletePointSuccess({ id: Number.parseInt(id) }))
        })
      }
    })

    dispatch(loadMap({ mapName: this.mapName }))

    this.addEventListener('em:close-pane', () => dispatch(selectPoint({ id: undefined })))
    this.addEventListener('em:toggle-meta', () => { this.showMeta = !this.showMeta })

    fromEvent<CustomEvent>(this, 'em:point-update').pipe(
      debounceTime(500),
      tap((evt) => {
        dispatch(updatePoint({ point: evt.detail }))
      })
    ).subscribe()
  }

  disconnectedCallback(): void {
    this.eventSource.close()
  }

  private pointClick(event: CustomEvent) {
    event.preventDefault()
    dispatch(selectPoint({ id: event.detail.id }))
  }

  navigateAndOpenPoint(point: Point): void {
    dispatch(selectPoint({ id: point.id }))
    this.leafletMap.navigateToPoint(point.location)
  }

  render() {
    return html`
      <em-nav mapName=${this.mapName}></em-nav>
      <main>
        <em-map-pane ?aria-expanded=${this.showMeta}>
          <h2>Points</h2>
          <ul>
          ${this.points?.value ? repeat(this.points?.value, (point) => point.id,
            p => html`<li class="mapPoint" @click=${() => this.navigateAndOpenPoint(p)}>${p.id} : ${p.name ?? 'unnamed point'}</li>`
          ): 'no points in map'}
          </ul>
        </em-map-pane>

        <em-leaflet-map .contextMenu="${this.contextMenu}" controls>
          ${this.points?.value ? repeat(this.points?.value, (point) => point.id,
            p => html`<em-point id=${p.id} .latlng=${p.location} @click=${this.pointClick}></em-point>`
          ): ''}
        </em-leaflet-map>

        <em-point-pane ?active=${!!this.selectedPoint.value} .point=${this.selectedPoint.value}></em-point-pane>
      </main>
    `
  }
  static styles = [
    css`
    :host {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    main {
      flex-grow: 1;
      position: relative;
      overflow: hidden;
      display: flex;
      inset: 0;
      background: pink;
    }

    ul {
      display: grid;
      gap: 0.5em;
      list-style: none;
      padding: 0;
      margin: 0;

      li.mapPoint {
          text-decoration: underline;
          color: blue;
        }
    }
  `,
  ]
}
