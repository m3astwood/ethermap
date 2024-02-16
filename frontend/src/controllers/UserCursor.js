import * as L from 'leaflet'
import io from '../api/socket.js'

// HACK this needs to be finessed
import SvgCursor from '../components/SvgCursor.js'

export default class UserCursor {
  constructor(host) {
    this.host = host
    this.host.addController(this)

    this.socket = io
    this.cursors = []
  }

  hostConnected() {
    this.socket.on('mousemove', (data) => {
      // TODO@mx check whether user is in view before rendering
      // TODO@mx restrict rendering within range of zoom-level
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
        }).addTo(this.host.leaflet)
      }

      // update cursor's position
      this.cursors[user.id].setLatLng([pos.lat, pos.lng])
    })

    // track other users on disconnect
    this.socket.on('user-disconnected', (id) => {
      this.cursors[id].remove()
      delete this.cursors[id]
    })
  }

  mouseMove(latlng) {
    this.socket.emit('mousemove', latlng)
  }
}
