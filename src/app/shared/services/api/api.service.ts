import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';
import { CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { v4 as uuidv4 } from 'uuid';
import { ProjectSettingsService } from '../project-settings/project-settings.service';
import { CartService } from '../cart/cart.service';
import { Cart, CartResponseDto } from '../cart/cart.interface';
import { CustomerService } from '../customer/customer.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly projectSettingsService = inject(ProjectSettingsService);
    private readonly customerService = inject(CustomerService);
    private readonly cardService = inject(CartService);
    private readonly httpClient = inject(HttpClient);

    checkUserByEmail(email: string) {
        return this.httpClient.head(`/customers?where=${encodeURIComponent(`email="${email}"`)}`);
    }

    createAnonymousCart(): Observable<Cart> {
        return this.httpClient
            .post<Cart>(
                '/carts',
                { currency: 'EUR', anonymousId: uuidv4() },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .pipe(
                tap(cart => {
                    this.cardService.setCart(cart);
                }),
            );
    }

    setProjectSettings() {
        return this.httpClient
            .get<ProjectSettings>(`?scope=view_project_settings:${environment.projectKey}`)
            .pipe(
                tap(settings => {
                    this.projectSettingsService.setProjectSettings(settings);
                }),
            );
    }

    getCustomerByPasswordFlowToken(): Observable<CustomerResponseDto> {
        return this.httpClient
            .get<CustomerResponseDto>('/me', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .pipe(
                tap(response => {
                    this.customerService.customer = response.customer;
                }),
            );
    }

    getCartByPasswordFlowToken(): Observable<CartResponseDto> {
        return this.httpClient.get<CartResponseDto>('/me/carts', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
