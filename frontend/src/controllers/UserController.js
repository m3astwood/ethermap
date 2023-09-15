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

      console.log(user)

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
      console.log('sending', body)

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const json = await res.json()
      console.log(json)
    } catch (err) {
      console.error(err)
    }
  }
}
