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
        path: '',
        pathMatch: 'full',
        component: BooksPageComponent,
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    },
];
