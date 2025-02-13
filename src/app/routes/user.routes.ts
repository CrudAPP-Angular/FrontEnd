import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { LoginGuard } from '../shared/guards/login.guard';


export const userRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: async () => {
            const c = await import('../auth/login/userLogin/user-login.component');
            return c.UserLoginComponent
        },
        canActivate: [LoginGuard],
    },
    {
        path: 'register',
        loadComponent: async () => {
            const c = await import('../auth/register/userRegister/register.component');
            return c.RegisterComponent;
        },
        canActivate: [LoginGuard]
    },
    {
        path: 'home',
        loadComponent: async () => {
            const c = await import('../user/home/home.component');
            return c.HomeComponent;
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'home/profile',
        loadComponent: async () => {
            const c = await import('../user/profile/profile.component');
            return c.ProfileComponent;
        },
        canActivate: [AuthGuard]
    },

];
