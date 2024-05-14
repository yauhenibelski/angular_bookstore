import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnonymousCard } from './cart.interface';

@Injectable({
    providedIn: 'root',
})
export class AnonymousCardService {
    private readonly anonymousCard$ = new BehaviorSubject<AnonymousCard | null>(null);

    get card(): Observable<AnonymousCard | null> {
        return this.anonymousCard$.asObservable();
    }

    set card(card: AnonymousCard | null) {
        this.anonymousCard$.next(card);
    }

    get value(): AnonymousCard | null {
        return this.anonymousCard$.value;
    }
}
