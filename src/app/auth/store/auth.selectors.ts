import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAuthState } from "../../shared/models/authState.model";

const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const isAuthenticated = createSelector(selectAuthState, (state: IAuthState) => state);
export const user = createSelector(selectAuthState, (state: IAuthState) => state.user);
export const accessToken = createSelector(selectAuthState, (state: IAuthState) => state.token);