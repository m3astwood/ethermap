import { Exome } from 'exome'

class UserStore extends Exome {
  data = {}

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

      console.log(this.settings)

      await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: this.settings })
      })
    } catch (err) {
      // TODO@m3astwood add feedback of success/error
      console.error(err)
    }
  }
}

export default new UserStore()
