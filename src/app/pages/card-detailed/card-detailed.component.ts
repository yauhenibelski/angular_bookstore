import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { filter, tap } from 'rxjs';
import { CentsToEurosPipe } from 'src/app/shared/pipes/cents-to-euros/cents-to-euros.pipe';

@Component({
    selector: 'app-card-detailed',
    standalone: true,
    imports: [CurrencyPipe, AsyncPipe, GalleryModule, LightboxModule, CentsToEurosPipe],
    templateUrl: './card-detailed.component.html',
    styleUrl: './card-detailed.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailedComponent {
    private readonly productStoreService = inject(ProductStoreService);

    @Input() set key(key: string | undefined) {
        this.productStoreService.loadProductByKey(`${key}`);
    }

    readonly book$ = this.productStoreService.currentProduct$.pipe(
        filter(Boolean),
        tap(book => {
            const { images } = book.masterVariant;

            this.images = [...images].map(img => new ImageItem({ src: img.url, thumb: img.url }));
        }),
    );

    images: GalleryItem[] = [];
}
