import { LitElement, html, css } from 'lit'

import Router from './controllers/Router.js'

import './components/UserTool.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('ethermap-app')
export class EthermapApp extends LitElement {

  @property({ state: true })
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
