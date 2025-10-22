import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import { type Observable, switchMap, tap, from } from 'rxjs'
import { loadMap, loadMapError, loadMapSuccess } from '../actions/map'
import { setMap } from '../reducers/map'
import { rpcClient } from '../../api/rpcClient'

const effects = {
  loadMap$: createEffect((actions$) =>
    actions$.pipe(
      ofType(loadMap),
      switchMap(
        (action: Action): Observable<Response> => from(rpcClient.api.maps[':name'].$get({
          param: {
            name: action.mapName
          }
        }))
      ),
      switchMap((res: Response) => from(res.json())),
      tapResult(
        async (mapData) => {
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
