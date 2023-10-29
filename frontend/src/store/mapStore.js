import { Exome } from "exome";

class MapStore extends Exome {
  data = {}
  points = []

  _toCoords(location) {
    return `(${location.lat}, ${location.lng})`
  }

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
      point.location = this._toCoords(point.location)

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

      this.setPoints([ ...this.points, await res.json() ])
    } catch (err) {
      console.error(err)
    }
  }

  async updatePoint(point) {
    try {
      const body = {
        point: {
          name: point.name || '',
          notes: point.notes || ''
        }
      }

      await fetch(`/api/point/${point.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error(err)
    }
  }

  async deletePoint(id) {
    try {
      let points = this.points
      const idx = this.points.findIndex(p => p.id == id)
      const res = await fetch(`/api/point/${id}`, {
        method: 'DELETE',
      })

      if (res.status != 200) {
        throw new Error(res)
      }

      points.splice(idx, 1)
      this.setPoints([ ...points ])
    } catch (err) {
      console.error(err)
    }
  }
}

export default new MapStore()
