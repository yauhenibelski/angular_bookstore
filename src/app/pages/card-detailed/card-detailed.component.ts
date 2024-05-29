import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-card-detailed',
    standalone: true,
    imports: [CurrencyPipe, AsyncPipe, GalleryModule, LightboxModule],
    templateUrl: './card-detailed.component.html',
    styleUrl: './card-detailed.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailedComponent implements OnInit {
    private readonly productStoreService = inject(ProductStoreService);

    @Input() set id(id: string | undefined) {
        this.productStoreService.loadProductByID(`${id}`);
    }

    book$ = this.productStoreService.currentProduct$;

    images: GalleryItem[] = [];

    ngOnInit() {
        this.book$.pipe(untilDestroyed(this), filter(Boolean)).subscribe(book => {
            const { images } = book.masterVariant;

            this.images = [...images].map(img => new ImageItem({ src: img.url, thumb: img.url }));
        });
    }
}
