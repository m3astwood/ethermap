import { mapState } from '../store/mapState'
import type { Point } from '../../interfaces/Point'
import { addEntities, deleteEntities } from '@ngneat/elf-entities'

export function setPoint(point: Point) {
  mapState.update(addEntities(point))
}

export function removePoint(id: number) {
  mapState.update(deleteEntities(id))
}
