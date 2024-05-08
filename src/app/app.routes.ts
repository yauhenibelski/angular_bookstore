import { Routes } from '@angular/router';
import { BooksPageComponent } from './pages/books/books-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: BooksPageComponent,
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
