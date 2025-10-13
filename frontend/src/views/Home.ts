import { css, html, LitElement } from 'lit'

import '../components/NewMapModal'
import '../components/LeafletMap'

class HomeView extends LitElement {
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
