import * as Sentry from '@sentry/browser'
import { css, html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import Router from './controllers/Router'

import './components/UserTool'
import { dispatch } from '@ngneat/effects'
import { getUser } from './state/actions/user'
import './state/effects/user'

@customElement('ethermap-app')
export class EthermapApp extends LitElement {
  @state()
  route = Router.render()

  async firstUpdated() {
    Router.addEventListener('route-changed', () => {
      this.route = Router.render()
    })

    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      tracesSampleRate: 0.01,
      environment: import.meta.env.PROD ? 'production' : import.meta.env.DEV ? 'development' : 'staging',
    })

    dispatch(getUser())
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
