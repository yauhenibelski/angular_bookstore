import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, effect } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CentsToEurosPipe } from '../../shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { BookComponent } from './book/book.component';
import { ClearCartMessageComponent } from './clear-cart-message/clear-cart-message.component';
import { CLEAR_CART_MASSAGE } from './clear-cart-message/clear-cart-message-config.token';
import { GetTotalPriceAfterDiscountPipe } from './pipes/get-total-price-after-discount.pipe';

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
        ReactiveFormsModule,
        GetTotalPriceAfterDiscountPipe,
    ],
})
export class CartPageComponent {
    readonly cart = this.cartService.cart;

    constructor(
        @Inject(CLEAR_CART_MASSAGE) private readonly matDialogConfig: MatDialogConfig<unknown>,
        private readonly cartService: CartService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar,
    ) {
        effect(() => {
            if (this.cart()?.discountOnTotalPrice) {
                this.openSnackBar();
            }
        });

        this.cartService.loadDiscountCodes();
    }

    readonly discountInput = new FormControl('', { nonNullable: true });

    openDialog(): void {
        this.dialog.open(ClearCartMessageComponent, this.matDialogConfig);
    }

    applyDiscount(): void {
        const code = { code: this.discountInput.getRawValue() };

        this.cartService.updateCart('addDiscountCode', code, err => {
            const errorMessage = err?.error['message'];

            this.openSnackBar(errorMessage);
        });
    }

    openSnackBar(errorMessage?: string): void {
        const message = errorMessage || 'You have successfully applied the discount';

        this.snackBar.open(`${message}`, undefined, {
            duration: 3000,
            panelClass: errorMessage ? 'snack-bar-err' : 'snack-bar-success',
        });
    }
}
