import { LitElement, html, css } from 'lit'
import './components/PointModal.js'
import Router from './controllers/Router.js'

class EthermapApp extends LitElement {
  static get properties() {
    return {
      route: {}
    }
  }

  constructor() {
    super()
    this.route = Router.render()
  }

  firstUpdated() {
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
    <nav>toolbar</nav>
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
        padding-inline: 0.75em;
        padding-block: 0.75em;
      }
    `
  }
}

window.customElements.define('ethermap-app', EthermapApp)
