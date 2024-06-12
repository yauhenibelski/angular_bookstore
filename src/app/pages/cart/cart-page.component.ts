import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CentsToEurosPipe } from '../../shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { BookComponent } from './book/book.component';

@Component({
    selector: 'app-cart-page',
    standalone: true,
    templateUrl: './cart-page.component.html',
    styleUrl: './cart-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CentsToEurosPipe,
        CurrencyPipe,
        MatIconModule,
        MatCardModule,
        RouterLink,
        BookComponent,
    ],
})
export class CartPageComponent {
    readonly totalCount = computed(() => this.cartService.cart()?.totalPrice.centAmount);
    readonly products = computed(() => this.cartService.cart()?.lineItems);

    constructor(readonly cartService: CartService) {}
}
