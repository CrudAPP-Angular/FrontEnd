import { Routes } from '@angular/router';
import { userRoutes } from './routes/user.routes';
import { adminRoutes } from './routes/admin.routes';

export const routes: Routes = [
    ...userRoutes,
    ...adminRoutes

];
