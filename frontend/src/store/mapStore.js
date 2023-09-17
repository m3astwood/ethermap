import { Exome } from "exome";

class MapStore extends Exome {
  data = {}
  points = []

  async get(name) {
    try {
      const res = await fetch(`/api/map/${name}`)

      if (res.status != 200)  throw new Error(res.statusText)

      const { map, points } = await res.json()

      this.data = { ...map }
      this.points = [ ...points ]
    } catch (err) {
      console.error(err)
    }
  }

  setPoints(array) {
    this.points = array
  }

  getPoints() {
    return this.points
  }

  async createPoint(point) {
    try {
      // set location to point for db
      point.location = `(${point.location.lat}, ${point.location.lng})`

      const res = await fetch('/api/point/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mapId: this.data.id,
          point
        })
      })

      this.points = [ ...this.points, await res.json() ]
    } catch (err) {
      console.error(err)
    }
  }

  async updatePoint() {

  }

  async deletePoint() {

  }
}

export default new MapStore()
