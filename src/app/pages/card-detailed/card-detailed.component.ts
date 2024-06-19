import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { concatMap, filter, iif, tap } from 'rxjs';
import { CentsToEurosPipe } from 'src/app/shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-card-detailed',
    standalone: true,
    imports: [CurrencyPipe, AsyncPipe, GalleryModule, LightboxModule, CentsToEurosPipe],
    templateUrl: './card-detailed.component.html',
    styleUrl: './card-detailed.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailedComponent {
    @Input() set key(key: string | undefined) {
        this.productStoreService.loadProductByKey(`${key}`);
    }

    readonly eventEmitter = new EventEmitter<string>();

    readonly book$ = this.productStoreService.currentProduct$.pipe(
        filter(Boolean),
        tap(book => {
            const { images } = book.masterData.current.masterVariant;

            this.images = [...images].map(img => new ImageItem({ src: img.url, thumb: img.url }));
        }),
    );

    constructor(
        private readonly productStoreService: ProductStoreService,
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

    images: GalleryItem[] = [];
}
