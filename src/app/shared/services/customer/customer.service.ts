import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer-response-dto';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    private readonly customer$ = new BehaviorSubject<Customer | null>(null);

    get customer(): Observable<Customer | null> {
        return this.customer$.asObservable();
    }

    set customer(customer: Customer | null) {
        this.customer$.next(customer);
    }
}
