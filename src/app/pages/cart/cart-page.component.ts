import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CentsToEurosPipe } from '../../shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { BookComponent } from './book/book.component';

@Component({
    selector: 'app-cart-page',
    standalone: true,
    templateUrl: './cart-page.component.html',
    styleUrl: './cart-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        CentsToEurosPipe,
        CurrencyPipe,
        MatIconModule,
        MatCardModule,
        RouterLink,
        BookComponent,
    ],
})
export class CartPageComponent {
    totalCount = 0;

    readonly productsInCart$ = this.cartService.cart$.pipe(
        filter(Boolean),
        map(cart => {
            this.totalCount = cart.totalPrice.centAmount;

            return cart.lineItems;
        }),
    );

    constructor(
        readonly cartService: CartService,
        readonly apiService: ApiService,
    ) {}

    q() {
        this.apiService.createAnonymousCart().subscribe();
    }
}
