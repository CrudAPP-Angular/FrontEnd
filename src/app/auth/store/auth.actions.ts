import { createAction, props } from '@ngrx/store';

import { IAdmin, IUser } from '../../shared/models/user.model';


//* User Actions.
export const loginRequest = createAction('[Auth] Login Request');
export const loginSuccess = createAction('[Auth] Login Success', props<{ token: string, user: IUser }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const isAuthenticated = createAction('[Auth] Authentication', props<{ isAuthenticated: boolean }>());
export const updateUser = createAction('[User] Update user', props<{ user: IUser }>())
export const logout = createAction('[Auth Logout]');

//* Admin Actions.
export const AdminLoginRequest = createAction('[Auth] Admin Login Request');
export const AdminLoginSuccess = createAction('[Auth] Admin Login Success', props<{ token: string, admin: IAdmin }>());
export const AdminLoginFailure = createAction('[Auth] Admin Login Failure', props<{ error: string }>());
export const isAdminAuthenticated = createAction('[Auth] Admin Authentication', props<{ isAdminAuthenticated: boolean }>());
export const AdminLogout = createAction('[Auth] Admin Logout');