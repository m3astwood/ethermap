export default class PointController {
  constructor(host) {
    this.host = host
    this.host.addController(this)
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

      console.log(await res.json())
    } catch (err) {
      console.error(err)
    }
  }
}
