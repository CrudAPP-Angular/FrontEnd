import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { IAuthState } from '../../shared/models/authState.model';

export const initialAuthState: IAuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    admin: null,
    adminToken: null,
    isAdminAuthenticated: false,
    error: null,
    loading: true,
};

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.loginRequest, (state) => ({
        ...state,
        error: null,
        loading: true,
    })),
    on(AuthActions.AdminLoginRequest, (state) => ({
        ...state,
        error: null,
        loading: true,
    })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
        ...state,
        user,
        token,
        error: null,
        loading: false,
        isAuthenticated: true
    })),
    on(AuthActions.AdminLoginSuccess, (state, { admin, token }) => ({
        ...state,
        admin,
        adminToken: token,
        loading: false,
        error: null,
        isAdminAuthenticated: true,
    })),
    on(AuthActions.updateUser, (state, { user }) => ({
        ...state,
        user
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        error,
        isAuthenticated: false,
        loading: false
    })),
    on(AuthActions.AdminLoginFailure, (state, { error }) => ({
        ...state,
        isAdminAuthenticated: false,
        loading: false,
        error,
    })),
    on(AuthActions.logout, () => initialAuthState),
    on(AuthActions.AdminLogout, () => initialAuthState),
);
