import L from 'leaflet'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import io from '../api/socket.js'

// FIX: this needs to be finessed
import SvgCursor from '../components/SvgCursor'
import type { UserData, UserServerData } from '../interfaces/User.js'

export default class UserCursor implements ReactiveController {
  host: ReactiveControllerHost
  socket = io
  cursors: L.Marker[] = []
  leafletMap: L.Map

  constructor(host: ReactiveControllerHost, leafletMap: L.Map) {
    this.host = host
    this.host.addController(this)
    this.leafletMap = leafletMap
  }

  hostConnected() {
    this.socket.on('user-updated', (user: UserData) => {
      const cursorIcon = L.divIcon({
        html: SvgCursor(user.colour),
        iconSize: [20, 30],
        iconAnchor: [0, 8],
        className: 'user-cursor',
      })

      this.cursors[user.id].setIcon(cursorIcon)
    })

    this.socket.on('mousemove', (data: UserServerData) => {
      // TODO:
      // - check whether user is in view before rendering
      // - restrict rendering within range of zoom-level
      const { user, pos } = data

      // if user is not created, then do so
      if (!this.cursors[user.id]) {
        const cursorIcon = L.divIcon({
          html: SvgCursor(user.colour),
          iconSize: [20, 30],
          iconAnchor: [0, 8],
          className: 'user-cursor',
        })

        this.cursors[user.id] = L.marker([pos.lat, pos.lng], {
          icon: cursorIcon,
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(this.leafletMap)
      }

      // update cursor's position
      this.cursors[user.id].setLatLng([pos.lat, pos.lng])
    })

    // track other users on disconnect
    this.socket.on('user-disconnected', (id: number) => {
      this.cursors[id].remove()
      delete this.cursors[id]
    })
  }

  mouseMove(latlng: L.LatLng) {
    this.socket.emit('mousemove', latlng)
  }
}
