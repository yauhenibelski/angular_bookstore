import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer-response-dto';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    private readonly customerSubject = new BehaviorSubject<Customer | null>(null);

    get customer$(): Observable<Customer | null> {
        return this.customerSubject.asObservable();
    }

    setCustomer(customer: Customer | null) {
        this.customerSubject.next(customer);
    }
}
