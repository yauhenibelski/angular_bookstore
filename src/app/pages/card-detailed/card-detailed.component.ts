import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';

@Component({
    selector: 'app-card-detailed',
    standalone: true,
    imports: [CurrencyPipe, AsyncPipe],
    templateUrl: './card-detailed.component.html',
    styleUrl: './card-detailed.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailedComponent implements OnInit {
    private readonly productStoreService = inject(ProductStoreService);
    @Input() id?: string | undefined;

    book$ = this.productStoreService.currentProduct$;

    ngOnInit(): void {
        this.productStoreService.loadProductByID(`${this.id}`);
    }
}
