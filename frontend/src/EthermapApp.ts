import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import Router from './controllers/Router'

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

    dispatch(getUser())
  }

  render() {
    return this.route
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: lightgrey;
      }

    `
  }
}
