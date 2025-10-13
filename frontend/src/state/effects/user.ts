import { createEffect, dispatch, ofType, registerEffects, tapResult } from '@ngneat/effects'
import { map, type Observable, switchMap } from 'rxjs'
import { api } from '../../api/httpApi'
import type { UserData } from '../../interfaces/User'
import { getUser, getUserSuccess, updateUser, updateUserSuccess, userError } from '../actions/user'
import { setUser } from '../reducers/user'

const effects = {
  getUser$: createEffect((actions$) =>
    actions$.pipe(
      ofType(getUser),
      switchMap(
        (): Observable<{ user: UserData }> =>
          api.get('/api/user').pipe(
            tapResult(
              ({ user }) => {
                dispatch(getUserSuccess({ user }))
              },
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
        api.post('/api/user', action.user).pipe(
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
