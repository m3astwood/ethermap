import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import { type Observable, switchMap, tap } from 'rxjs'
import type MapModel from '../../../../backend/db/models/map'
import { loadMap, loadMapError, loadMapSuccess } from '../actions/map'
import { setMap } from '../reducers/map'
import { api } from '../../api/httpApi'
import type { Point } from '../../interfaces/Point'

const effects = {
  loadMap$: createEffect((actions$) =>
    actions$.pipe(
      ofType(loadMap),
      switchMap(
        (action: Action): Observable<{ map: MapModel; points: Point[] }> =>
          api.get(`/api/map/${action.mapName}`).pipe(
            tapResult(
              (mapData) => dispatch(loadMapSuccess({ mapData })),
              (error: Error) => dispatch(loadMapError({ error })),
            ),
          ),
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
