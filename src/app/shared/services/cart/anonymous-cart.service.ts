import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class AnonymousCardService {
    private readonly anonymousCard$ = new BehaviorSubject<Cart | null>(null);

    get card(): Observable<Cart | null> {
        return this.anonymousCard$.asObservable();
    }

    set card(card: Cart | null) {
        this.anonymousCard$.next(card);
    }

    get value(): Cart | null {
        return this.anonymousCard$.value;
    }
}
