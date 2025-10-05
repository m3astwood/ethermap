import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import { type Observable, switchMap, tap } from 'rxjs'
import type { SelectMapSchema } from '../../../../backend/db/schema/map.schema'
import { loadMap, loadMapError, loadMapSuccess } from '../actions/map'
import { setMap } from '../reducers/map'
import { api } from '../../api/httpApi'
import type { Point } from '../../interfaces/Point'

const effects = {
  loadMap$: createEffect((actions$) =>
    actions$.pipe(
      ofType(loadMap),
      switchMap((action: Action): Observable<{ map: SelectMapSchema; points: Point[] } | undefined> => api.get(`/api/map/${action.mapName}`)),
      tapResult(
        (mapData) => {
          if (mapData) {
            return dispatch(loadMapSuccess({ mapData }))
          }

          throw Error('Failed to load map from server')
        },
        (error: Error) => dispatch(loadMapError({ error })),
      ),
    ),
  ),

  loadMapSuccess$: createEffect((actions) =>
    actions.pipe(
      ofType(loadMapSuccess),
      tapResult(
        (mapData) => setMap(mapData),
        () => {},
      ),
    ),
  ),

  loadMapError$: createEffect((actions) => actions.pipe(ofType(loadMapError), tap(console.error))),
}

registerEffects([...Object.values(effects)])
export default { ...effects }
