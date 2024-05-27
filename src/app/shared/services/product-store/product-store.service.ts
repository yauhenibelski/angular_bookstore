import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class ProductStoreService {
    private readonly productsSubject = new BehaviorSubject<Product[] | null>(null);

    private activeSubscription: Subscription | null = null;

    constructor(private readonly apiService: ApiService) {}

    get products$() {
        return this.productsSubject.asObservable();
    }

    loadProductsByCategory(categoryID: string): void {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
        }

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

        this.activeSubscription = this.apiService.getProducts().subscribe(products => {
            this.productsSubject.next(products.sort(() => 0.5 - Math.random()));
        });
    }
}
