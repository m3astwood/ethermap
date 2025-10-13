import { actionsFactory, initEffects, props } from '@ngneat/effects'
import type { UserData } from '../../interfaces/User'

initEffects()

export const userActions = actionsFactory('USER')

export const getUser = userActions.create('Get user')
export const getUserSuccess = userActions.create('Get user Success', props<{ user: UserData }>())

export const updateUser = userActions.create('Update user', props<{ user: UserData }>())
export const updateUserSuccess = userActions.create('Update user Success', props<{ user: UserData }>())

export const userError = userActions.create('User ERROR', props<{ error: Error }>())
