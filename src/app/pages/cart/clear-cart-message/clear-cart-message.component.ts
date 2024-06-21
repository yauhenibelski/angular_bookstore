import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { CLEAR_CART_MASSAGE } from './clear-cart-message-config.token';

@Component({
    selector: 'app-clear-cart-message',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './clear-cart-message.component.html',
    styleUrl: './clear-cart-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearCartMessageComponent {
    constructor(
        @Inject(CLEAR_CART_MASSAGE) private readonly matDialogConfig: MatDialogConfig<unknown>,
        private readonly cartService: CartService,
        private readonly dialog: MatDialog,
    ) {}

    close(confirm?: boolean): void {
        const matDialog = this.dialog.getDialogById(`${this.matDialogConfig.id}`);

        if (confirm) {
            this.cartService.updateCart('removeLineItem', { removeAll: true });
        }

        matDialog?.close();
    }
}
