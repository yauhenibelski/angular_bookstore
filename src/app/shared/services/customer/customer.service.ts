import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Addresses, Customer } from 'src/app/interfaces/customer-response-dto';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    private readonly customerSubject = new BehaviorSubject<Customer | null>(null);

    get customer(): Customer | null {
        return this.customerSubject.value;
    }

    get customer$(): Observable<Customer | null> {
        return this.customerSubject.asObservable();
    }

    setCustomer(customer: Customer | null): void {
        this.customerSubject.next(customer);
    }

    get addresses(): Addresses | null {
        if (!this.customerSubject.value) {
            return null;
        }

        const { addresses, shippingAddressIds } = this.customerSubject.value;

        return addresses.reduce(
            (acc: Addresses, address) => {
                if (shippingAddressIds.includes(`${address.id}`)) {
                    acc.shipping.push(address);
                } else {
                    acc.billing.push(address);
                }

                return acc;
            },
            { shipping: [], billing: [] },
        );
    }
}
