import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import { from, type Observable, switchMap } from 'rxjs'
import { rpcClient } from '../../api/rpcClient'
import type { UserData } from '../../interfaces/User'
import { getUser, getUserSuccess, updateUser, updateUserSuccess, userError } from '../actions/user'
import { setUser } from '../reducers/user'

const effects = {
  getUser$: createEffect((actions$) =>
    actions$.pipe(
      ofType(getUser),
      switchMap((): Observable<Response> => from(rpcClient.api.users.$get())),
      switchMap((res: Response) =>
        from(res.json()).pipe(
          tapResult(
            ({ user }) => dispatch(getUserSuccess({ user })),
            (error: Error) => dispatch(userError({ error })),
          ),
        ),
      ),
    ),
  ),
  getUserSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(getUserSuccess),
      tapResult(
        ({ user }) => setUser(user),
        (error: Error) => dispatch(userError({ error })),
      ),
    ),
  ),
  updateUser$: createEffect((actions$) =>
    actions$.pipe(
      ofType(updateUser),
      switchMap((action) =>
        from(
          rpcClient.api.users.$post({
            json: action.user,
          }),
        ).pipe(
          switchMap((res: Response): Observable<{ user: UserData }> => from(res.json())),
          tapResult(
            ({ user }) => dispatch(updateUserSuccess({ user })),
            (error: Error) => dispatch(userError({ error })),
          ),
        ),
      ),
    ),
  ),
  updateUserSuccess$: createEffect((actions$) =>
    actions$.pipe(
      ofType(updateUserSuccess),
      tapResult(
        (res) => {
          setUser(res.user)
        },
        (error: Error) => dispatch(userError({ error })),
      ),
    ),
  ),
  userError$: createEffect((actions$) => actions$.pipe(ofType(userError), tapResult(console.log, console.error))),
}

registerEffects([...Object.values(effects)])
export default { ...effects }
