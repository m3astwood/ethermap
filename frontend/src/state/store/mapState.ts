import { createStore, withProps } from '@ngneat/elf'
import { withEntities } from '@ngneat/elf-entities'
import type MapModel from '../../../../backend/db/models/map'
import type { Point } from '../../interfaces/Point'

export interface MapStateProps {
  map: MapModel
  user: {
    name: string
    colour: string
  }
  selectedPoint: Point | undefined
}

export const mapState = createStore(
  { name: 'map' },
  withProps<MapStateProps>({
    map: {} as MapModel,
    user: {
      name: '',
      colour: '',
    },
    selectedPoint: undefined,
  }),
  withEntities<Point>(),
)
