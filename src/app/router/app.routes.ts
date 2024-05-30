import { Routes } from '@angular/router';
import { BooksPageComponent } from '../pages/books/books-page.component';
import { RegistrationPageComponent } from '../pages/registration/registration-page.component';
import { LoginPageComponent } from '../pages/login/login-page.component';
import { NotFoundPageComponent } from '../pages/404/not-found-page.component';
import { isLoggedGuard } from './guards/is-loggined/is-logged.guard';
import { CartPageComponent } from '../pages/cart/cart-page.component';
import { ProfilePageComponent } from '../pages/profile/profile-page.component';
import { CardDetailedComponent } from '../pages/card-detailed/card-detailed.component';
import { isUnregisteredGuard } from './guards/is-unregistered/is-unregistered.guard';
import { MainComponent } from '../pages/main/main.component';
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
        component: MainComponent,
    },
    {
        path: 'books',
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
        path: 'detailed',
        redirectTo: 'main',
        pathMatch: 'full',
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [isUnregisteredGuard],
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
