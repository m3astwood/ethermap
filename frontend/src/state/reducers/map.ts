import { setEntities } from '@ngneat/elf-entities'
import { mapState } from '../store/mapState'
import type { Point } from '../../interfaces/Point'

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

