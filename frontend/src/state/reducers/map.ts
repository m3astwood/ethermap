import { setEntities } from '@ngneat/elf-entities'
import { mapState } from '../store/mapState'

export function setMap({ mapData }) {
  const map = mapData
  const points = mapData.mapPoints
  delete map.mapPoints

  mapState.update((state) => ({
    ...state,
    map
  }))

  mapState.update(setEntities(points))
}

