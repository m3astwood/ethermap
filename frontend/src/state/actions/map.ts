import { actionsFactory, props, initEffects } from '@ngneat/effects'
import type MapModel from '../../../../backend/db/models/map'
import type { Point } from '../../interfaces/Point'

initEffects()

export const mapActions = actionsFactory('MAP')
export const loadMap = mapActions.create('Load', props<{ mapName: string }>())
export const loadMapError = mapActions.create('Load Error', props<{ error: Error }>())
export const loadMapSuccess = mapActions.create('Load Success', props<{ mapData: { map: MapModel, points: Array<Point> } }>())
