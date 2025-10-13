import { LitElement, html, css } from 'lit'
import { live } from 'lit/directives/live.js'
import { fromEvent, debounceTime, tap, map } from 'rxjs'
import { dispatch } from '@ngneat/effects'

// store
import { updateUser } from '../state/actions/user'
import { state } from 'lit/decorators.js'
import ObserveCtrl from '../controllers/Observable'
import { mapState } from '../state/store/mapState'

class UserTool extends LitElement {
  @state()
  user = new ObserveCtrl(this, mapState.pipe(map(mapState => mapState.user)))

  @state()
  userForm: HTMLFormElement

  @state()
  cursorWithin = false

  firstUpdated() {
    this.userForm = this.shadowRoot?.querySelector('.dropdown') as HTMLFormElement
    fromEvent(this.userForm, 'change').pipe(
      debounceTime(500),
      tap(() => {
        const formData = new FormData(this.userForm)
        const user = Object.fromEntries(formData)
        // @ts-ignore: user has required properties
        dispatch(updateUser({ user }))
      })
    ).subscribe()

    this.addEventListener('mouseleave', () => {
      this.cursorWithin = false
    })

    this.addEventListener('mouseenter', () => {
      this.cursorWithin = true
    })

    window.addEventListener('mousedown', () => {
      if (!this.cursorWithin) {
        this.userForm.classList.remove('active')
      }
    })
  }

  toggleDropdown() {
    this.userForm.classList.toggle('active')
  }

  render() {
    return html`
      <button @click=${this.toggleDropdown}>
        USR
      </button>

      <form class="dropdown">
        <input name="name" placeholder="name" value=${live(this.user?.value?.name)}></input>
        <input name="colour" type="color" value=${live(this.user?.value?.colour)}></input>
      </form>
    `
  }

  static get styles() {
    return css`
    button {
      background: none;
      border: none;
      padding: 0em;
      cursor: pointer;
    }

    button > img {
      display: block;
      height: 2.5em;
      aspect-ratio: 1/1;
    }

    .dropdown {
      --padding: 0.25em;
      display: none;
      position: absolute;
      right: 1em;
      top: 3em;
      max-width: 12em;
      background: white;
      padding: var(--padding);
      outline: thin solid black;
      z-index: 100000;
    }

    .dropdown > input {
      width: calc(100% - calc(var(--padding) * 2));
    }

    .dropdown.active {
      display: grid;
      grid-auto-flow: rows;
      gap: 0.25em;
    }
    `
  }
}

window.customElements.define('user-tool', UserTool)
