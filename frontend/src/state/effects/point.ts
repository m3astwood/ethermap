import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import { from, switchMap } from 'rxjs'
import { rpcClient } from '../../api/rpcClient'
import type { Point } from '../../interfaces/Point'
import { createPoint, createPointSuccess, deletePoint, deletePointSuccess, pointError, selectPoint, updatePoint, updatePointSuccess } from '../actions/point'
import { removePoint, selectPoint as selPoint, setPoint, updatePoint as updatePointReducer } from '../reducers/point'

const effects = {
  createPoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(createPoint),
      switchMap((action: Action) => {
        return from(
          rpcClient.api.points.$post({
            json: { ...action.point, mapId: action.mapId },
          }),
        ).pipe(
          switchMap((res: Response) => from(res.json())),
          tapResult(
            (point: Point) => dispatch(createPointSuccess({ point })),
            (error: Error) => dispatch(pointError({ error })),
          ),
        )
      }),
    ),
  ),

  createPointSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(createPointSuccess),
      tapResult(
        ({ point }) => {
          setPoint(point)
        },
        (error: Error) => dispatch(pointError({ error })),
      ),
    ),
  ),

  updatePoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(updatePoint),
      switchMap((action: Action) =>
        from(
          rpcClient.api.points[':id'].$put({
            param: {
              id: action.point.id,
            },
            json: action.point,
          }),
        ).pipe(
          switchMap((res: Response) => from(res.json())),
          tapResult((point) => dispatch(updatePointSuccess({ point })), console.error),
        ),
      ),
    ),
  ),

  updatePointSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(updatePointSuccess),
      tapResult(({ point }) => updatePointReducer(point)),
    ),
  ),

  deletePoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(deletePoint),
      switchMap((action: Action) =>
        from(
          rpcClient.api.points[':id'].$delete({
            param: {
              id: action.id,
            },
          }),
        ).pipe(
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

  selectPoint$: createEffect((actions$) =>
    actions$.pipe(
      ofType(selectPoint),
      tapResult(({ id }) => {
        return selPoint(id)
      }),
    ),
  ),

  pointError$: createEffect((actions$) => actions$.pipe(ofType(pointError), tapResult(console.log, console.error))),
}

registerEffects([...Object.values(effects)])
export default { ...effects }
