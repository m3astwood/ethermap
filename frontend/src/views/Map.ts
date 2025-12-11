import type { LeafletMouseEvent } from 'leaflet'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { debounceTime, fromEvent, tap } from 'rxjs'
import io from '../api/socket'
import 'leaflet-contextmenu'
import 'leaflet/dist/leaflet.css'

// import UserCursor from '../controllers/UserCursor'
import ObserveCtrl from '../controllers/Observable'
import '../components/LeafletMap'
import '../components/EmPoint'
import '../components/PointPane'
import { dispatch } from '@ngneat/effects'
// state & effects
import { select } from '@ngneat/elf'
import type { Observable } from 'rxjs'
import { loadMap } from '../state/actions/map'
import { createPoint, createPointSuccess, deletePointSuccess, selectPoint, updatePoint, updatePointSuccess } from '../state/actions/point'
import { mapState } from '../state/store/mapState'
import '../state/effects/map'
import '../state/effects/point'

import { selectAllEntities } from '@ngneat/elf-entities'
// interfaces
import type MapModel from '../../../backend/db/models/map'
import type { Point } from '../interfaces/Point'

@customElement('map-view')
export class MapView extends LitElement {
  // controllers
  // userCursor = new UserCursor(this)
  points = new ObserveCtrl(this, mapState.pipe(selectAllEntities()))
  selectedPoint = new ObserveCtrl(this, mapState.pipe(select((state) => state.selectedPoint)))

  @property({ type: String })
  mapName = ''

  @state()
  private mapId: number

  @state()
  private contextMenu: Array<{ text: string; callback(event: LeafletMouseEvent): void }>

  @state()
  private map$: Observable<MapModel>

  @state()
  private eventSource: EventSource

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
    this.map$.subscribe((map) => {
      this.mapId = map?.id ?? null
      if (this.mapId) {
        this.eventSource = new EventSource(`/api/maps/${this.mapId}/events`)

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

    this.addEventListener('em:viewport-changed', ({ detail }) => {
      console.log('VIEWPORT-CHANGED :', detail)
      // update mapSession
    })

    fromEvent<CustomEvent>(this, 'em:point-update')
      .pipe(
        debounceTime(500),
        tap((evt) => {
          dispatch(updatePoint({ point: evt.detail }))
        }),
      )
      .subscribe()
  }

  disconnectedCallback(): void {
    this.eventSource.close()
  }

  private pointClick(event: CustomEvent) {
    event.preventDefault()
    dispatch(selectPoint({ id: event.detail.id }))
  }

  render() {
    return html`
      <main>
        <em-leaflet-map .contextMenu="${this.contextMenu}" controls>
          ${
            this.points?.value
              ? repeat(
                  this.points?.value,
                  (point) => point.id,
                  (p) => html`<em-point id=${p.id} .latlng=${p.location} @click=${this.pointClick}></em-point>`,
                )
              : ''
          }
        </em-leaflet-map>
        <em-point-pane ?active=${!!this.selectedPoint.value} .point=${this.selectedPoint.value}></em-point-pane>
      </main>
    `
  }

  static styles = [
    css`
    :host {
      flex-grow: 1;
    }

    main {
      height: 100%;
      display: flex;
      overflow: hidden;
    }
  `,
  ]
}
