import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import { createPoint, createPointSuccess, deletePoint, deletePointSuccess, pointError, updatePoint } from '../actions/point'
import { switchMap } from 'rxjs'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import type { Point } from '../../interfaces/Point'
import { setPoint, removePoint } from '../reducers/map'
import { api } from '../../api/httpApi'

const effects = {
  createPoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(createPoint),
      switchMap((action: Action) =>
        api.post('/api/point', { mapId: action.mapId, point: action.point }).pipe(
          tapResult(
            (point: Point) => dispatch(createPointSuccess({ point })),
            (error: Error) => dispatch(pointError({ error })),
          ),
        ),
      ),
    ),
  ),
  createPointSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(createPointSuccess),
      tapResult(
        (pointData) => {
          const { point } = pointData
          setPoint(point)
        },
        (error: Error) => dispatch(pointError({ error })),
      ),
    ),
  ),

  updatePoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(updatePoint),
      switchMap((action: Action) => api.put(`/api/point/${action.point.id}`, { point: action.point }).pipe(tapResult(() => {}, console.error))),
    ),
  ),

  deletePoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(deletePoint),
      switchMap((action: Action) =>
        api.delete(`/api/point/${action.id}`).pipe(
          tapResult(
            () => dispatch(deletePointSuccess({ id: action.id })),
            (error: Error) => dispatch(pointError({ error })),
          ),
        ),
      ),
    ),
  ),

  deletePointSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(deletePointSuccess),
      tapResult((response) => {
        removePoint(response.id)
      }, console.error),
    ),
  ),
  pointError$: createEffect((actions$) => actions$.pipe(ofType(pointError), tapResult(console.log, console.error))),
}

registerEffects([...Object.values(effects)])
export default { ...effects }
