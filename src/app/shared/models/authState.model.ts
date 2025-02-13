import { IUser } from "./user.model";

export interface IAuthState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    admin: IUser | null;
    adminToken: string | null;
    isAdminAuthenticated: boolean;
    error: string | null;
    loading: boolean
}
