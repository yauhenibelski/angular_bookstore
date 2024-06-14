import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, computed } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { CentsToEurosPipe } from '../../shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { BookComponent } from './book/book.component';
import { ClearCartMessageComponent } from './clear-cart-message/clear-cart-message.component';
import { CLEAR_CART_MASSAGE } from './clear-cart-message/clear-cart-message-config.token';

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
        MatButtonModule,
        MatDialogModule,
    ],
})
export class CartPageComponent {
    readonly totalCount = computed(() => this.cartService.cart()?.totalPrice.centAmount);
    readonly products = computed(() => this.cartService.cart()?.lineItems);

    constructor(
        @Inject(CLEAR_CART_MASSAGE) private readonly matDialogConfig: MatDialogConfig<unknown>,
        readonly cartService: CartService,
        private readonly dialog: MatDialog,
    ) {}

    openDialog(): void {
        this.dialog.open(ClearCartMessageComponent, this.matDialogConfig);
    }
}
