import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Product } from 'src/app/interfaces/product';
import { Cart, CartResponseDto, UpdatePayload } from './cart.interface';
import { Action } from './actions';
import { DiscountCode, DiscountDto } from './discount.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cartSignal = signal<Cart | null>(null);
    private readonly discountCodesSignal = signal<DiscountCode[] | null>(null);
    private readonly appliedDiscountSignal = signal<DiscountCode | null>(null);

    readonly cart = computed(() => this.cartSignal());
    readonly discountCodes = computed(() => this.discountCodesSignal());
    readonly appliedDiscount = computed(() => this.appliedDiscountSignal());

    private updateCartSubscription: Subscription | null = null;
    private loadDiscountCodesSubscription: Subscription | null = null;

    constructor(private readonly httpClient: HttpClient) {}

    private get cartId(): string {
        return `${this.cart()?.id}`;
    }

    setCart(cart: Cart): void {
        this.cartSignal.set(cart);

        const discountId = cart.discountOnTotalPrice?.includedDiscounts.at(0)?.discount.id;

        if (discountId) {
            this.loadDiscountCodeById(discountId);

            return;
        }

        this.appliedDiscountSignal.set(null);
    }

    quantityOfProducts(): Signal<number> {
        return computed(() => {
            const cart = this.cartSignal();

            if (!cart) {
                return 0;
            }

            const quantity = cart.lineItems.reduce((acc: number, product: Product) => {
                acc += Number(product.quantity);

                return acc;
            }, 0);

            return quantity;
        });
    }

    hasProductInCart(productId: string): Signal<boolean> {
        const product = this.cartSignal()?.lineItems.find(
            product => product.productId === productId,
        );

        return computed(() => !!product);
    }

    getProductCartIdByProductId(id: string): string {
        const cart = this.cartSignal();

        if (!cart || !cart.lineItems.length) {
            return '';
        }

        const product = cart.lineItems.find(product => product.productId === id);

        return `${product?.id}`;
    }

    getDiscountIdByKey(key: string): string {
        const discountCodes = this.discountCodesSignal();

        if (!discountCodes) {
            return '';
        }

        const discount = discountCodes.find(discount => discount.key === key);

        return `${discount?.id}`;
    }

    loadDiscountCodeById(id: string): void {
        if (this.loadDiscountCodesSubscription) {
            this.loadDiscountCodesSubscription.unsubscribe();
        }

        this.httpClient.get<DiscountCode>(`/cart-discounts/${id}`).subscribe({
            next: discount => {
                this.appliedDiscountSignal.set(discount);
            },
            complete: () => {
                this.updateCartSubscription = null;
            },
        });
    }

    updateCart(
        action: Action,
        payload: UpdatePayload,
        reject?: (err?: HttpErrorResponse) => void,
    ): void {
        const { productId, quantity, removeAll, discountCodeId } = payload;
        const cart = this.cartSignal();

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

        if (action === 'removeDiscountCode' && discountCodeId) {
            actions.push({
                action,
                discountCode: {
                    typeId: 'discount-code',
                    id: discountCodeId,
                },
            });
        }

        this.updateCartSubscription = this.httpClient
            .post<Cart>(`/carts/${this.cartId}`, {
                version: cart.version,
                actions,
            })
            .subscribe({
                next: cart => {
                    this.setCart(cart);
                },
                complete: () => {
                    this.updateCartSubscription = null;
                },
                error: (error: unknown) => {
                    if (error instanceof HttpErrorResponse && reject) {
                        reject(error);
                    }
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
                    this.setCart(cart);
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

                    this.setCart(cart);
                }),
            );
    }

    loadDiscountCodes(): void {
        if (this.loadDiscountCodesSubscription) {
            this.loadDiscountCodesSubscription.unsubscribe();
        }

        this.loadDiscountCodesSubscription = this.httpClient
            .get<DiscountDto>('/discount-codes')
            .subscribe({
                next: response => {
                    this.discountCodesSignal.set(response.results);
                },
                complete: () => {
                    this.loadDiscountCodesSubscription = null;
                },
            });
    }

    addDiscountCode(
        code: string,
        cb: { fulfilled: () => void; reject: (error: HttpErrorResponse) => void },
    ): void {
        const cart = this.cartSignal();

        if (!cart) {
            return;
        }

        if (this.updateCartSubscription) {
            this.updateCartSubscription.unsubscribe();
        }

        this.updateCartSubscription = this.httpClient
            .post<Cart>(`/carts/${this.cartId}`, {
                version: cart.version,
                actions: [{ action: 'addDiscountCode', code }],
            })
            .subscribe({
                next: cart => {
                    this.setCart(cart);

                    cb.fulfilled();
                },
                complete: () => {
                    this.updateCartSubscription = null;
                },
                error: (error: unknown) => {
                    if (error instanceof HttpErrorResponse) {
                        cb.reject(error);
                    }
                },
            });
    }
}
