import { Routes } from '@angular/router';
import { authGuard } from '@qavo/core';
import { HomeComponent } from './pages/home.component';
import { ProtectedComponent } from './pages/protected.component';

/**
 * Application routes. Auth/login and registration routes are contributed by the
 * plugins (via the `ROUTES` multi-token); the not-found and forbidden routes are
 * contributed by the platform in `app.config.ts`.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    title: 'Protected',
    canActivate: [authGuard],
  },
];
