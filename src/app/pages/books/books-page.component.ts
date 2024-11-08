import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SortProductService } from 'src/app/shared/services/sort-product/sort-product.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CentsToEurosPipe } from 'src/app/shared/pipes/cents-to-euros/cents-to-euros.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { SearchComponent } from './search/search.component';
import { CategoryComponent } from './category/category.component';

@UntilDestroy()
@Component({
    selector: 'app-books-page',
    standalone: true,
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterOutlet,
        CurrencyPipe,
        ReactiveFormsModule,
        CategoryComponent,
        SearchComponent,
        MatSidenavModule,
        NavLinkComponent,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSliderModule,
        CentsToEurosPipe,
        MatMenuModule,
    ],
})
export class BooksPageComponent {
    readonly form = new FormGroup({
        sort: new FormControl(this.sortProductService.params.sort, { nonNullable: true }),
        priceRange: new FormGroup({
            min: new FormControl(this.sortProductService.priceRange.min, { nonNullable: true }),
            max: new FormControl(this.sortProductService.priceRange.max, { nonNullable: true }),
        }),
    });

    rangeValue = this.sortProductService.priceRange;

    constructor(
        readonly sortProductService: SortProductService,
        private readonly productStoreService: ProductStoreService,
    ) {
        this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
            const { priceRange } = this.form.getRawValue();

            this.rangeValue = priceRange;
        });
    }

    get sortParams() {
        return this.sortProductService.params;
    }

    setSortValue(): void {
        const {
            sort,
            priceRange: { min, max },
        } = this.form.getRawValue();

        this.sortProductService.setSortValue(sort);
        this.sortProductService.setPriceRange(Number(min), Number(max));

        this.productStoreService.loadProducts();
    }

    resetSortValue(): void {
        const { priceRange, sort } = this.form.controls;

        this.sortProductService.resetSortValue();

        priceRange.reset();
        sort.reset();

        this.productStoreService.loadProducts();
    }
}
