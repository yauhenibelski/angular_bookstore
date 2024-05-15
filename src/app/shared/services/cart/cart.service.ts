import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly cartSubject = new BehaviorSubject<Cart | null>(null);

    get cart$() {
        return this.cartSubject.asObservable();
    }

    setCart(cart: Cart | null): void {
        this.cartSubject.next(cart);
    }

    get cart() {
        return this.cartSubject.value;
    }
}
