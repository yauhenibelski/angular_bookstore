import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cartSubject = new BehaviorSubject<Cart | null>(null);

    constructor(private readonly httpClient: HttpClient) {}

    get cart$() {
        return this.cartSubject.asObservable();
    }

    get cart() {
        return this.cartSubject.value;
    }

    private get cartId() {
        return `${this.cartSubject.value?.id}`;
    }

    setCart(cart: Cart | null): void {
        this.cartSubject.next(cart);
    }

    hasProductInCart(productId: string): boolean {
        return Boolean(this.cart?.lineItems.find(product => product.id === productId));
    }

    private addToCartSubscription: Subscription | null = null;

    addToCart(productId: string): void {
        if (this.addToCartSubscription) {
            this.addToCartSubscription.unsubscribe();
        }

        const payload = {
            action: 'addLineItem',
            productId,
            quantity: 1,
        };

        this.addToCartSubscription = this.httpClient
            .post<Cart>(`/carts/${this.cartId}`, {
                version: this.cart?.version,
                actions: [payload],
            })
            .subscribe({
                next: cart => this.cartSubject.next(cart),
                complete: () => {
                    this.addToCartSubscription = null;
                },
            });
    }
}
