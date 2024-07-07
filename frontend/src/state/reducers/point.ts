import { mapState } from '../store/mapState'
import type { Point } from '../../interfaces/Point'
import { addEntities, deleteEntities, getEntity, updateEntities } from '@ngneat/elf-entities'
import { pointUserParser } from '../utils/userSessionParser'

export function setPoint(point: Point) {
  mapState.update(
    addEntities({
      ...pointUserParser(point),
    }),
  )
}

export function updatePoint(point: Point) {
  mapState.update(
    updateEntities(point.id, {
      ...pointUserParser(point),
    }),
  )
}

export function removePoint(id: number) {
  mapState.update(deleteEntities(id))
}

export function selectPoint(id?: number) {
  if (id) {
    const selectedPoint = mapState.query(getEntity(id))
    mapState.update((state) => ({
      ...state,
      selectedPoint,
    }))
  } else {
    mapState.update(state => ({
      ...state,
      selectedPoint: undefined
    }))
  }
}
