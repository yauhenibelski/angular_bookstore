import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly isLogined$ = new BehaviorSubject<boolean>(false);

    get isLogined(): Observable<boolean> {
        return this.isLogined$.asObservable();
    }

    set isLogined(value: boolean) {
        this.isLogined$.next(value);
    }
}
