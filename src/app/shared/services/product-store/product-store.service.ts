import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class ProductStoreService {
    private readonly productsSubject = new BehaviorSubject<Product[] | null>(null);
    private readonly productSubject = new BehaviorSubject<Product | null>(null);

    private activeSubscription: Subscription | null = null;

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

    loadProductByID(id: string) {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

        this.productSubject.next(null);

        this.activeSubscription = this.apiService
            .getProductByID(id)
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

    loadProductsByCategory(categoryID: string): void {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

        this.productsSubject.next(null);

        this.activeSubscription = this.apiService
            .getProductsByCategoryID(categoryID)
            .subscribe(products => {
                this.productsSubject.next(products);
            });
    }

    loadProducts() {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

        this.productsSubject.next(null);

        this.activeSubscription = this.apiService.getProducts().subscribe(products => {
            this.productsSubject.next(products);
        });
    }
}
