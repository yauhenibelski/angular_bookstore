import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '../pages/404/not-found-page.component';
import { isLoggedGuard } from './guards/is-loggined/is-logged.guard';
import { isUnregisteredGuard } from './guards/is-unregistered/is-unregistered.guard';
import { MainComponent } from '../pages/main/main.component';

export const routes: Routes = [
    {
        path: 'registration',
        loadComponent: () =>
            import('../pages/registration/registration-page.component').then(
                m => m.RegistrationPageComponent,
            ),
        canActivate: [isLoggedGuard],
    },
    {
        path: 'login',
        loadComponent: () =>
            import('../pages/login/login-page.component').then(m => m.LoginPageComponent),
        canActivate: [isLoggedGuard],
    },
    {
        path: 'main',
        component: MainComponent,
    },
    {
        path: 'books',
        loadComponent: () =>
            import('../pages/books/books-page.component').then(m => m.BooksPageComponent),
        children: [
            {
                path: ':category',
                loadComponent: () =>
                    import('../pages/books/cards-list/cards-list.component').then(
                        m => m.CardsListComponent,
                    ),
            },
            {
                path: ':category/:subcategory',
                loadComponent: () =>
                    import('../pages/books/cards-list/cards-list.component').then(
                        m => m.CardsListComponent,
                    ),
            },
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('../pages/books/cards-list/cards-list.component').then(
                        m => m.CardsListComponent,
                    ),
            },
        ],
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('../pages/cart/cart-page.component').then(m => m.CartPageComponent),
    },
    {
        path: 'detailed/:key',
        loadComponent: () =>
            import('../pages/card-detailed/card-detailed.component').then(
                m => m.CardDetailedComponent,
            ),
    },
    {
        path: 'detailed',
        pathMatch: 'full',
        redirectTo: '/books',
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('../pages/profile/profile-page.component').then(m => m.ProfilePageComponent),
        canActivate: [isUnregisteredGuard],
    },
    {
        path: 'about',
        loadComponent: () =>
            import('../pages/about-us/about-page.component').then(m => m.AboutPageComponent),
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
