import { LitElement, css, html } from 'lit'

import '../components/NewMapModal.js'
import '../components/LeafletMap.js'

class HomeView extends LitElement {
  static properties = {}

  constructor() {
    super()
  }

  render() {
    return html`
      <em-leaflet-map></em-leaflet-map>
      <newmap-modal></newmap-modal>
    `
  }

  static styles = css`
    :host {
      display: flex;
      flex-grow: 1;
    }
  `
}

customElements.define('home-view', HomeView)
