import { setEntities } from '@ngneat/elf-entities'
import { mapState } from '../store/mapState'

export function setMap({ mapData }) {
  const { map, points } = mapData
  mapState.update((state) => ({
    ...state,
    map
  }))

  mapState.update(setEntities(points))
}
