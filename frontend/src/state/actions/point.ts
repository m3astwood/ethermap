import { actionsFactory, props, initEffects } from '@ngneat/effects'
import type { Point } from '../../interfaces/Point'

initEffects()

export const pointActions = actionsFactory('POINT')
export const createPoint = pointActions.create('Create', props<{ mapId: number, point: { name?: string, location: { lat: number, lng: number } } }>())
export const updatePoint = pointActions.create('Update', props<{ point: Point }>())
export const deletePoint = pointActions.create('Delete', props<{ id: number }>())

export const createPointSuccess = pointActions.create('Create success', props<{ point: Point }>())
export const updatePointSuccess = pointActions.create('Update success', props<{ point: Point }>())
export const deletePointSuccess = pointActions.create('Delete success', props<{ id: number }>())

export const pointError = pointActions.create('Error', props<{ error: Error }>())
