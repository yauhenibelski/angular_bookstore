import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly isLoginedSubject = new BehaviorSubject<boolean>(false);

    get isLogined() {
        return this.isLoginedSubject.value;
    }

    get isLogined$(): Observable<boolean> {
        return this.isLoginedSubject.asObservable();
    }

    setLoginStatus(value: boolean) {
        this.isLoginedSubject.next(value);
    }
}
