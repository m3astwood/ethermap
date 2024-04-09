import {
  createEffect,
  dispatch,
  ofType,
  registerEffects,
  tapResult,
} from '@ngneat/effects'
import type { Action } from '@ngneat/effects/src/lib/actions.types'
import { type Observable, switchMap, tap } from 'rxjs'
import type MapModel from '../../../../backend/db/models/map'
import type PointModel from '../../../../backend/db/models/point'
import { loadMap, loadMapError, loadMapSuccess } from '../actions/map'
import { setMap } from '../reducers/map'
import { api } from '../../api/httpApi'

export const loadMap$ = createEffect((actions$) =>
  actions$.pipe(
    ofType(loadMap),
    switchMap(
      (action: Action): Observable<{ map: MapModel; points: Array<PointModel> }> =>
        api.get(`/api/map/${action.mapName}`).pipe(
          tapResult(
            (mapData) =>  dispatch(loadMapSuccess({ mapData })),
            (error: Observable<Error>) => dispatch(loadMapError({ error }))
          ),
        ),
    ),
  ),
)

export const loadMapError$ = createEffect((actions) =>
  actions.pipe(ofType(loadMapError), tap(console.error)),
)

export const loadMapSuccess$ = createEffect((actions) =>
  actions.pipe(
    ofType(loadMapSuccess),
    tapResult(
      (mapData) => setMap(mapData),
      () => {},
    ),
  ),
)

registerEffects([loadMap$, loadMapError$, loadMapSuccess$])
