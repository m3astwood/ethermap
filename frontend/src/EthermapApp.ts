import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import Router from './controllers/Router'

import './components/UserTool'

@customElement('ethermap-app')
export class EthermapApp extends LitElement {

  @state()
  route = Router.render()

  async firstUpdated() {
    Router.addEventListener('route-changed', () => {
      this.route = Router.render()
    })
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
        height: 100vh;
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
