import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { SortProductService } from '../sort-product/sort-product.service';

@Injectable({
    providedIn: 'root',
})
export class ProductStoreService {
    private readonly sortProductService = inject(SortProductService);

    private readonly productsSubject = new BehaviorSubject<Product[] | null>(null);
    private readonly productSubject = new BehaviorSubject<Product | null>(null);

    private isLoadAdditionalProducts = false;
    private totalProducts = 0;

    private activeSubscription: Subscription | null = null;
    private activeLoadAdditionalProductsSubscription: Subscription | null = null;

    constructor(
        private readonly apiService: ApiService,
        private readonly router: Router,
    ) {}

    get products$() {
        return this.productsSubject.asObservable();
    }

    get currentProduct$() {
        return this.productSubject.asObservable();
    }

    loadProductByKey(id: string): void {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

        this.productSubject.next(null);

        this.activeSubscription = this.apiService
            .getProductByKey(id)
            .pipe(map(productDto => productDto.masterData.current))
            .subscribe({
                next: product => {
                    this.productSubject.next(product);
                },
                error: () => {
                    this.router.navigateByUrl('404');
                },
            });
    }

    loadProducts(): void {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

        this.productsSubject.next(null);

        this.sortProductService.offset = 0;

        this.activeSubscription = this.apiService.getProducts().subscribe(response => {
            this.totalProducts = response.total;
            this.productsSubject.next(response.results);
        });
    }

    loadAdditionalProducts(): void {
        const currentProducts = this.productsSubject.value;

        if (
            !currentProducts ||
            this.isLoadAdditionalProducts ||
            currentProducts.length === this.totalProducts
        ) {
            return;
        }

        if (this.activeLoadAdditionalProductsSubscription) {
            this.activeLoadAdditionalProductsSubscription.unsubscribe();
        }

        this.isLoadAdditionalProducts = true;

        this.sortProductService.offset = currentProducts.length;

        this.activeLoadAdditionalProductsSubscription = this.apiService.getProducts().subscribe({
            next: products => {
                this.productsSubject.next([...currentProducts, ...products.results]);
            },
            complete: () => {
                this.isLoadAdditionalProducts = false;
            },
        });
    }
}
