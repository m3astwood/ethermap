import { Exome } from 'exome'
import io from '../api/socket.js'

class UserStore extends Exome {
  data = {}
  settings = {
    name: '',
    colour: '',
  }

  async getSettings() {
    try {
      const res = await fetch('/api/user')
      const { user } = await res.json()

      this.data = user
    } catch (err) {
      console.error(err)
    }
  }

  async updateSettings(field, value) {
    try {
      this.settings[field] = value

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: this.settings }),
      })

      if (res.status !== 200) {
        throw Error(res)
      }


      io.emit('user-updated', this.settings)
    } catch (err) {
      // TODO@mx add feedback of success/error
      console.error(err)
    }
  }
}

export default new UserStore()
