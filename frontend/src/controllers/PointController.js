export default class PointController {
  constructor(host) {
    this.host = host
    this.host.addController(this)

    this.list = []
  }

  hostConnected() {
    console.log('connected to', this.host)

    window.addEventListener('point-saved', ({ detail: newPoint }) => {
      console.log('point created', newPoint)
      this.list = [ ...this.list, newPoint ]
      this.host.setPoint(newPoint)
    })
  }

  static async savePoint(mapId, point) {
    try {
      // set location to point for db
      point.location = `(${point.location.lat}, ${point.location.lng})`

      const res = await fetch('http://localhost:3000/api/point/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mapId,
          point
        })
      })

      const newPoint = await res.json()
      return newPoint
    } catch (err) {
      console.error(err)
    }
  }
}
