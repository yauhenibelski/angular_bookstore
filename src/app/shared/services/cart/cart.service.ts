import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cart$ = new BehaviorSubject<Cart | null>(null);

    get cart(): Observable<Cart | null> {
        return this.cart$.asObservable();
    }

    set cart(cart: Cart | null) {
        this.cart$.next(cart);
    }

    get value(): Cart | null {
        return this.cart$.value;
    }
}
