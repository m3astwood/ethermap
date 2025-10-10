import { LitElement, css, html } from 'lit'

import '../components/NewMapModal'
import '../components/EmMap'

class HomeView extends LitElement {
  render() {
    return html`
      <em-map></em-map>
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
