import { Routes } from "@angular/router";

import { AdminGuard } from "../shared/guards/admin.guard";

export const adminRoutes: Routes = [
    {
        path: 'admin/login',
        loadComponent: async () => {
            const c = await import('../auth/login/adminLogin/login.component');
            return c.AdminLoginComponent;
        }
    },
    {
        path: 'admin/register',
        loadComponent: async () => {
            const c = await import('../auth/register/adminRegister/adminRegister.component');
            return c.AdminRegisterComponent;
        }
    },
    {
        path: 'admin/dashboard',
        loadComponent: async () => {
            const c = await import('../admin/dashboard/dashboard.component');
            return c.DashboardComponent;
        },
        canActivate: [AdminGuard]
    },
    {
        path: 'admin/users',
        loadComponent: async () => {
            const c = await import('../admin/usersPage/user.component');
            return c.UserPageComponent;
        },
        canActivate: [AdminGuard]
    },
    {
        path: 'admin/admins',
        loadComponent: async () => {
            const c = await import('../admin/adminsPage/admin.component');
            return c.adminPageComponent;
        },
        canActivate: [AdminGuard]
    }
]