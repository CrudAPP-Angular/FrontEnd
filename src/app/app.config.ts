import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MetaReducer, provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { userAuthInterceptorFn } from './auth/interceptors/userAuth.interceptor';
import { authReducer } from './auth/store/auth.reducer';
import { localStorageMetaReducer } from './auth/store/localstorage.reducer';

// export const metaReducers: MetaReducer[] = [localStorageMetaReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ auth: authReducer }),
    provideHttpClient(withInterceptors([userAuthInterceptorFn])),
  ]
};
