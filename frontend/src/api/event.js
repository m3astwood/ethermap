export default class EventController {
  constructor(host) {
    this.host = host
    this.host.addController(this)
  }

  // hostConnected() {
  //   console.log('EventController connected')
  // }
  //
  // hostDisconnected() {
  //   console.log('EventController disconnected')
  // }

  dispatch(event, options) {
    options = options || {}

    const opts = {
      bubbles: true,
      composed: true,
      ...options,
    }

    const e = new CustomEvent(event, opts)

    this.host.dispatchEvent(e)
  }
}
