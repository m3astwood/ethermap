import { setEntities } from '@ngneat/elf-entities'
import { mapState } from '../store/mapState'
import type { Point } from '../../interfaces/Point'
import { addEntities, deleteEntities } from '@ngneat/elf-entities'

export function setMap({ mapData }) {
  const { map, points } = mapData

  const pointsSession = points.map((p: Point) => {
    return {
      ...p,
      created_by_user: {
        ...p.created_by_user,
        // @ts-ignore: created_bu_user from server is string
        sess: JSON.parse(p.created_by_user.sess)
      },
      updated_by_user: {
        ...p.updated_by_user,
        // @ts-ignore: updated_bu_user from server is string
        sess: JSON.parse(p.updated_by_user.sess)
      }
    }
  })

  mapState.update((state) => ({
    ...state,
    map
  }))

  mapState.update(setEntities(pointsSession))
}

export function setPoint(point: Point) {
  mapState.update(addEntities(point))
}

export function removePoint(id: number) {
  mapState.update(deleteEntities(id))
}
