
import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { environment } from "../../../environment";
import { IAuthState } from "../../shared/models/authState.model";

const STORAGE_KEY = environment.STORAGE_KEY;

export function localStorageMetaReducer(reducer: ActionReducer<IAuthState>): ActionReducer<IAuthState> {
    return (state, action) => {
        console.log(state); //undefined 
        
        if (action.type === INIT || action.type === UPDATE) {
            const savedState = localStorage.getItem(STORAGE_KEY);
            return savedState ? JSON.parse(savedState) : state;
        }

        const newState = reducer(state, action);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return newState;
    }
}