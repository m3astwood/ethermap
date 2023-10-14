import { LitElement, html, css } from 'lit'
import './components/PointModal.js'
import './components/UserTool.js'
import Router from './controllers/Router.js'

class EthermapApp extends LitElement {

  static get properties() {
    return {
      route: { state: true },
      user: { state: true }
    }
  }

  constructor() {
    super()
    this.route = Router.render()
  }

  async firstUpdated() {
    Router.addEventListener('route-changed', () => {
      console.log('route-changed')
      this.route = Router.render()
    })

    this.addEventListener('open-modal', (evt) => {
      const modal = this.shadowRoot.querySelector('point-modal')
      modal.open(evt.detail.mapId, evt.detail.latlng)
    })
  }

  render() {
    return html`
    <nav>
      <span>toolbar</span>
      <user-tool></user-tool>
    </nav>
    ${this.route}
    <point-modal></point-modal>
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

window.customElements.define('ethermap-app', EthermapApp)
