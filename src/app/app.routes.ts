import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'registration',
        pathMatch: 'full',
    },
    {
        path: 'registration',
        loadComponent: () =>
            import('./pages/registration/registration-page.component').then(
                mod => mod.RegistrationPageComponent,
            ),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login-page.component').then(mod => mod.LoginPageComponent),
    },
    {
        path: '**',
        loadComponent: () =>
            import('./pages/404/not-found-page.component').then(mod => mod.NotFoundPageComponent),
    },
];
