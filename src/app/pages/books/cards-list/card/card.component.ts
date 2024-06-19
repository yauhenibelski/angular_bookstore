import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Product } from 'src/app/interfaces/product';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CentsToEurosPipe } from 'src/app/shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { concatMap, iif } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatButtonModule,
        CurrencyPipe,
        MatIconModule,
        RouterLink,
        CentsToEurosPipe,
        AsyncPipe,
    ],
})
export class CardComponent {
    @Input({ required: true }) book!: Product;
    readonly eventEmitter = new EventEmitter<string>();

    constructor(
        readonly cartService: CartService,
        destroyRef: DestroyRef,
    ) {
        this.eventEmitter
            .pipe(
                takeUntilDestroyed(destroyRef),
                concatMap(productId => {
                    return iif(
                        () => cartService.hasProductInCart(productId)(),

                        cartService.updateCart('removeLineItem', {
                            productId: cartService.getProductCartIdByProductId(productId),
                        }),

                        cartService.updateCart('addLineItem', { productId }),
                    );
                }),
            )
            .subscribe();
    }
}
