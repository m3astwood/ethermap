export default class UserController {
  constructor(host) {
    this.host = host
    this.host.addController(this)

    this.settings = {
      id: '',
      name: '',
      colour: ''
    }
  }

  async getUser() {
    try {
      const res = await fetch('/api/user')
      const { user } = await res.json()

      this.settings = user
      return this.settings
    } catch (err) {
      console.error(err)
    }
  }

  static async updateSettings(evt) {
    try {
      const body = { user: {} }
      body.user[evt.target.name] = evt.target.value

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      // TODO@m3astwood add feedback of success/error
    } catch (err) {
      console.error(err)
    }
  }
}
