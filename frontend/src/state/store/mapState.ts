import { createStore, withProps } from '@ngneat/elf'
import type MapModel from '../../../../backend/db/models/map'
import type { Point } from '../../interfaces/Point'
import { withEntities } from '@ngneat/elf-entities'

export interface MapStateProps {
  map: MapModel
}

export const mapState = createStore(
  { name: 'map' },
  withProps<MapStateProps>({
    map: {} as MapModel,
  }),
  withEntities<Point>()
)