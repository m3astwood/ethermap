export default class EventController {
  constructor(host) {
    this.host = host
    this.host.addController(this)
  }

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
