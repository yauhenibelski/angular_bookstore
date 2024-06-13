import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartResponseDto, UpdatePayload } from './cart.interface';
import { Action } from './actions';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    readonly cart = signal<Cart | null>(null);

    private updateCartSubscription: Subscription | null = null;

    constructor(private readonly httpClient: HttpClient) {}

    private get cartId(): string {
        return `${this.cart()?.id}`;
    }

    hasProductInCart(productId: string): Signal<boolean> {
        const product = this.cart()?.lineItems.find(product => product.productId === productId);

        return computed(() => !!product);
    }

    updateCart(action: Action, { productId, quantity, removeAll }: UpdatePayload): void {
        const cart = this.cart();

        if (!cart) {
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

        if (action === 'removeLineItem' && removeAll) {
            actions = [...cart.lineItems].map(({ id }) => ({ action, lineItemId: id }));
        }

        if (action === 'changeLineItemQuantity' && quantity) {
            actions.push({ action, quantity, lineItemId: productId });
        }

        this.updateCartSubscription = this.httpClient
            .post<Cart>(`/carts/${this.cartId}`, {
                version: cart.version,
                actions,
            })
            .subscribe({
                next: cart => {
                    this.cart.set(cart);
                },
                complete: () => {
                    this.updateCartSubscription = null;
                },
            });
    }

    createAnonymousCart(): Observable<Cart> {
        return this.httpClient
            .post<Cart>(
                '/carts',
                { currency: 'EUR', anonymousId: uuidv4() },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .pipe(
                tap(cart => {
                    this.cart.set(cart);
                }),
            );
    }

    getCartByPasswordFlowToken(): Observable<CartResponseDto> {
        return this.httpClient
            .get<CartResponseDto>('/me/carts', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .pipe(
                tap(cartRes => {
                    const cart = cartRes.results[0] ?? null;

                    this.cart.set(cart);
                }),
            );
    }
}
