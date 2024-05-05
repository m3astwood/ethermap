import type { ReactiveController, ReactiveControllerHost } from 'lit'

export default class EventController implements ReactiveController {
  host: ReactiveControllerHost
  private opts = {}

  constructor(host: ReactiveControllerHost) {
    this.host = host
    this.host.addController(this)
  }

  hostConnected(): void {
    this.opts = {
      bubbles: true,
      composed: true,
    }
  }

  dispatch(event: string, options = {}) {
    const opts = {
      ...this.opts,
      ...options,
    }

    const e = new CustomEvent(event, opts)

    // @ts-ignore: host is custom element and has dispatchEvent
    this.host.dispatchEvent(e)
  }
}
