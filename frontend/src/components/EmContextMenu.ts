import { Map as MapLibre, MapMouseEvent } from "maplibre-gl";
import EventController from "../api/event.ts";
import EventEmitter from "node:events";

interface ContextMenuOptions {
  entries: ContextMenuEntry[]
}

interface ContextMenuEntry {
  label: string
  event: string
}

export class ContextMenu extends EventTarget  {
  #open: boolean = false
  #map: MapLibre

  #menuEl: HTMLElement
  #eventData?: MapMouseEvent

  #menuEntries: Map<HTMLElement, (event: EventTarget) => void> = new Map()

  constructor(map: MapLibre, options?: ContextMenuOptions) {
    super()
    this.#map = map
    this.#menuEl = this.#createMenu()

    options?.entries.forEach(this.#createEntry.bind(this))

    this.#map.on('click', this.#hideMenu.bind(this))

    this.#map.on('contextmenu', (evt: MapMouseEvent) => {
      this.#eventData = evt
      this.#openMenu({ x: evt.originalEvent.layerX, y: evt.originalEvent.layerY })
    })
  }

  #createMenu() {
    const menu = document.createElement('div')
    menu.classList.add('map-context-menu')
    menu.popover = 'hint'
    menu.textContent = 'context-menu'

    const menuList = document.createElement('ul')
    menu.appendChild(menuList)

    document.body.appendChild(menu)

    return menu
  }

  #createEntry(entry: ContextMenuEntry) {
    const li = document.createElement('li')
    li.textContent = entry.label

    const listener = this.#createEvent(entry.event)
    this.#menuEntries.set(li, listener)

    li.addEventListener('click', listener)
    this.#menuEl.querySelector('ul')?.appendChild(li)
  }

  // emit event from click
  #createEvent(eventName: string) {
    return () => {
      const customEvent = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true, detail: this.#eventData })
      this.dispatchEvent(customEvent)
    }
  }


  #openMenu(point: { x: number, y: number }) {
    this.#menuEl.style.left = `${point.x}px`
    this.#menuEl.style.top = `${point.y}px`

    this.#menuEl.showPopover()
  }

  #hideMenu() {
    if (this.#open) {
      this.#open = false
      this.#menuEl.hidePopover()
    }
  }
}
