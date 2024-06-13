import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, filter, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from './cart.interface';
import { Action } from './actions';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cartSubject = new BehaviorSubject<Cart | null>(null);

    private updateCartSubscription: Subscription | null = null;

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

    hasProductInCart(productId: string): Observable<boolean> {
        return this.cartSubject.asObservable().pipe(
            filter(Boolean),
            map(({ lineItems }) => {
                return Boolean(lineItems.find(product => product.productId === productId));
            }),
        );
    }

    updateCart(action: Action, productId?: string, quantity?: number): void {
        if (!this.cart) {
            return;
        }

        if (this.updateCartSubscription) {
            this.updateCartSubscription.unsubscribe();
        }

        let actions: Array<Record<string, unknown>> = [];

        if (action === 'addLineItem') {
            actions.push({ action, productId });
        }

        if (action === 'removeLineItem' && productId) {
            actions.push({ action, lineItemId: productId });
        }

        if (action === 'removeLineItem' && !productId) {
            actions = [...this.cart.lineItems].map(({ id }) => ({ action, lineItemId: id }));
        }

        if (action === 'changeLineItemQuantity' && quantity) {
            actions.push({ action, quantity, lineItemId: productId });
        }

        this.updateCartSubscription = this.httpClient
            .post<Cart>(`/carts/${this.cartId}`, {
                version: this.cart?.version,
                actions,
            })
            .subscribe({
                next: cart => this.setCart(cart),
                complete: () => {
                    this.updateCartSubscription = null;
                },
            });
    }
}
