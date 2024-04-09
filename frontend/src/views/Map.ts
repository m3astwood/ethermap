import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import io from '../api/socket.js'

import type { LeafletMouseEvent } from 'leaflet'
import 'leaflet-contextmenu'
import leafletContextCss from 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import leafletCss from 'leaflet/dist/leaflet.css'

import UserCursor from '../controllers/UserCursor'
import ObserveCtrl from '../controllers/Observable'
import '../components/EmPoint.js'
import '../components/PointPopup.js'
import '../components/PointPane.js'
import { loadMap } from '../state/actions/map'
import { createPoint } from '../state/actions/point'

// state & effects
import { select } from '@ngneat/elf'
import { dispatch } from '@ngneat/effects'
import type { Observable } from 'rxjs'
import { mapState } from '../state/store/mapState'
import '../state/effects/map'
import '../state/effects/point'

// interfaces
import type MapModel from '../../../backend/db/models/map'
import type { Point } from '../interfaces/Point.js'
import { selectAllEntities } from '@ngneat/elf-entities'

@customElement('map-view')
export class MapView extends LitElement {
  // controllers
  // userCursor = new UserCursor(this)
  points = new ObserveCtrl(this, mapState.pipe(selectAllEntities()))

  @property({ type: String })
  mapName = ''

  @state()
  mapId: number

  @state()
  contextMenu: Array<{ text: string, callback(event: LeafletMouseEvent): void }>

  @state()
  selectedPoint: Point | undefined

  @state()
  map$: Observable<MapModel>

  @state()
  points$: Observable<Array<Point>>

  constructor() {
    super()

    this.map$ = mapState.pipe(select((state) => state.map))
    this.points$ = mapState.pipe(selectAllEntities())

    this.contextMenu = [
      {
        text: 'create point',
        callback: (evt: LeafletMouseEvent) => {
          dispatch(createPoint({ mapId: this.mapId, point: evt.latlng }))
        },
      },
    ]
  }

  async firstUpdated() {
    this.map$.subscribe((map) => {
      this.mapId = map.id

      console.log(map)

      // io connect to map
      io.emit('connect-map', this.mapId)

      if (this.leafletMap) {
        this.leafletMap.fitWorld().setZoom(3)
      }
    })

    dispatch(loadMap({ mapName: this.mapName }))
  }

  pointClick(event) {
    console.log('click', event)
  }

  render() {
    return html`
      <main>
        <em-leaflet-map .contextMenu=${this.contextMenu} controls>
          ${this.points?.value?.map(p => html`
            <em-point id=${p.id} .latlng=${p.location} @click=${this.pointClick}></em-point>
          `)}
        </em-leaflet-map>
        <em-point-pane ?active=${!!this.selectedPoint} .point=${this.selectedPoint}></em-point-pane>
      </main>
    `
  }

  static styles = [
    unsafeCSS(leafletCss),
    unsafeCSS(leafletContextCss),
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
