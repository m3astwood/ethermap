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
import '../components/EmPoint'
import '../components/PointPane'
import { loadMap } from '../state/actions/map'
import { createPoint, updatePoint } from '../state/actions/point'

// state & effects
import { select } from '@ngneat/elf'
import { dispatch } from '@ngneat/effects'
import type { Observable } from 'rxjs'
import { mapState } from '../state/store/mapState'
import '../state/effects/map'
import '../state/effects/point'

// interfaces
import type MapModel from '../../../backend/db/models/map'
import type { Point } from '../interfaces/Point'
import { getEntity, selectAllEntities } from '@ngneat/elf-entities'

@customElement('map-view')
export class MapView extends LitElement {
  // controllers
  // userCursor = new UserCursor(this)
  points = new ObserveCtrl(this, mapState.pipe(selectAllEntities()))

  @property({ type: String })
  mapName = ''

  @state()
  private mapId: number

  @state()
  private contextMenu: Array<{ text: string, callback(event: LeafletMouseEvent): void }>

  @state()
  private selectedPoint: Point | undefined

  @state()
  private map$: Observable<MapModel>

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
      this.mapId = map.id

      // io connect to map
      io.emit('connect-map', this.mapId)
    })

    dispatch(loadMap({ mapName: this.mapName }))

    this.addEventListener('em:close-pane', () => { this.selectedPoint = undefined })

    fromEvent<CustomEvent>(this, 'em:point-update').pipe(
      debounceTime(500),
      tap((evt) => {
        dispatch(updatePoint({ point: evt.detail }))
      })
    ).subscribe()
  }

  private pointClick(event: CustomEvent) {
    this.selectedPoint = mapState.query(getEntity(event.detail.id))
  }

  render() {
    return html`
      <main>
        <em-leaflet-map .contextMenu=${this.contextMenu} controls>
          ${this.points?.value ? repeat(this.points?.value, (point) => point.id,
            p => html`<em-point id=${p.id} .latlng=${p.location} @click=${this.pointClick}></em-point>`
          ): ''}
        </em-leaflet-map>
        <em-point-pane ?active=${!!this.selectedPoint} .point=${this.selectedPoint}></em-point-pane>
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
      background: pink;
    }
  `,
  ]
}
