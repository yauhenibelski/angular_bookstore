import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly Card$ = new BehaviorSubject<Cart | null>(null);

    get card(): Observable<Cart | null> {
        return this.Card$.asObservable();
    }

    set card(card: Cart | null) {
        this.Card$.next(card);
    }

    get value(): Cart | null {
        return this.Card$.value;
    }
}
