import * as Sentry from '@sentry/browser'
import { css, html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import Router from './controllers/Router'

import './components/UserTool'
import { dispatch } from '@ngneat/effects'
import { getUser } from './state/actions/user'
import './state/effects/user'
import { rpcClient } from './api/rpcClient'

@customElement('ethermap-app')
export class EthermapApp extends LitElement {
  @state()
  route = Router.render()

  async firstUpdated() {
    Router.addEventListener('route-changed', () => {
      this.route = Router.render()
    })

    this.setupSentry()

    dispatch(getUser())
  }

  async setupSentry() {
    try {
      const req = await rpcClient.api.environment.$get()

      if (req.error) {
        throw req.error
      }

      const env = await req.json()

      if (env.SENTRY_DSN) {
        console.log('Setting up Sentry')
        Sentry.init({
          dsn: env.SENTRY_DSN,
          tracesSampleRate: 0.01,
          environment: import.meta.env.MODE
        })
      }
    } catch(err) {
      console.error(err)
    }
  }

  render() {
    return html`
    <nav>
      <span>toolbar</span>
      <user-tool></user-tool>
    </nav>
    ${this.route}
    `
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100svh;
      }

      nav {
        display: flex;
        align-items: center;
        padding-inline: 1em;
        padding-block: 0.75em 0.5em;
      }

      user-tool {
        margin-inline-start: auto;
      }
    `
  }
}
