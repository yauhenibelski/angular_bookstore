import { Routes } from '@angular/router';
import { BooksPageComponent } from '../pages/books/books-page.component';
import { RegistrationPageComponent } from '../pages/registration/registration-page.component';
import { LoginPageComponent } from '../pages/login/login-page.component';
import { NotFoundPageComponent } from '../pages/404/not-found-page.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { CartPageComponent } from '../pages/cart/cart-page.component';
import { ProfilePageComponent } from '../pages/profile/profile-page.component';
import { CardDetailedComponent } from '../pages/card-detailed/card-detailed.component';
import { CardsListComponent } from '../pages/books/cards-list/cards-list.component';

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
        children: [
            {
                path: ':category',
                component: CardsListComponent,
            },
            {
                path: ':category/:subcategory',
                component: CardsListComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                component: CardsListComponent,
            },
        ],
    },
    {
        path: 'cart',
        component: CartPageComponent,
    },
    {
        path: 'detailed/:id',
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
