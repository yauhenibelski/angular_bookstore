import { Routes } from '@angular/router';
import { BooksPageComponent } from '../pages/books/books-page.component';
import { RegistrationPageComponent } from '../pages/registration/registration-page.component';
import { LoginPageComponent } from '../pages/login/login-page.component';
import { NotFoundPageComponent } from '../pages/404/not-found-page.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { CartPageComponent } from '../pages/cart/cart-page.component';
import { ProfilePageComponent } from '../pages/profile/profile-page.component';
import { CardDetailedComponent } from '../pages/books/card-detailed/card-detailed.component';

export const routes: Routes = [
    {
        path: 'registration',
        component: RegistrationPageComponent,
        canActivate: [isLoggedGuard],
    },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [isLoggedGuard],
    },
    {
        path: 'main',
        component: BooksPageComponent,
    },
    {
        path: 'cart',
        component: CartPageComponent,
    },
    {
        path: 'main/:id',
        component: CardDetailedComponent,
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main',
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    },
];
