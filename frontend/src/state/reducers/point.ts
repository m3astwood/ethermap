import { addEntities, deleteEntities, getEntity, updateEntities } from '@ngneat/elf-entities'
import type { Point } from '../../interfaces/Point'
import { mapState } from '../store/mapState'

export function setPoint(point: Point) {
  mapState.update(addEntities(point))
}

export function updatePoint(point: Point) {
  mapState.update(updateEntities(point.id, point))
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
    mapState.update((state) => ({
      ...state,
      selectedPoint: undefined,
    }))
  }
}
