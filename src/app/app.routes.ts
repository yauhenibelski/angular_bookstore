import { Routes } from '@angular/router';
import { BooksPageComponent } from './pages/books/books-page.component';
import { RegistrationPageComponent } from './pages/registration/registration-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { NotFoundPageComponent } from './pages/404/not-found-page.component';

export const routes: Routes = [
    {
        path: 'registration',
        component: RegistrationPageComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'main',
        component: BooksPageComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main', // technical requirements RSS-ECOMM-2_05
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    },
];
