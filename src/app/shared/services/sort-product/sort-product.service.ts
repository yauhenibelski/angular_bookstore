import { Injectable } from '@angular/core';
import { SortProduct } from './sort-product.interface';

@Injectable({
    providedIn: 'root',
})
export class SortProductService {
    private sortParams: SortProduct = {};
    private readonly minMaxPriceRange = {
        min: 1000,
        max: 4000,
    };

    offset = 0;

    priceRange = this.minMaxPriceRange;

    categoryID: string | null = null;

    get params(): SortProduct {
        return this.sortParams;
    }

    setSortValue(value: string | undefined): void {
        this.sortParams.sort = value;
    }

    setPriceRange(min: number, max: number): void {
        this.priceRange = { min, max };
        this.sortParams.filter = `variants.price.centAmount:range (${min} to ${max})`;
    }

    resetSortValue(): void {
        Object.entries(this.sortParams).forEach(([prop]) => {
            this.sortParams[prop as keyof SortProduct] = undefined;
        });

        this.priceRange = this.minMaxPriceRange;
    }
}
