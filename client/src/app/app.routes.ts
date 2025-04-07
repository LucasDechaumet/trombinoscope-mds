import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'trombinoscope',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'trombinoscope',
        title: 'Trombinoscope',
        loadComponent: () =>
          import(
            './pages/trombinoscope-general/trombinoscope-general.component'
          ).then((m) => m.TrombinoscopeGeneralComponent),
      },
      {
        path: 'trombinoscope/:classroom',
        title: 'Trombinoscope',
        loadComponent: () =>
          import(
            './pages/trombinoscope-general/trombinoscope-general.component'
          ).then((m) => m.TrombinoscopeGeneralComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'trombinoscope',
  },
];
