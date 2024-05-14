import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';
import { Customer, CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { SignupCustomer } from 'src/app/interfaces/signup-customer-request';
import { EMPTY, Observable, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token-response';
import { v4 as uuidv4 } from 'uuid';
import { AUTH_URL, HOST_URL } from '../../di-token/url-tokens';
import { ProjectSettingsService } from '../project-settings/project-settings.service';
import { CartService } from '../cart/cart.service';
import { Cart, CartResponseDto } from '../cart/cart.interface';
import { CustomerService } from '../customer/customer.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private accessToken: string | null = null;

    private readonly projectSettingsService = inject(ProjectSettingsService);
    private readonly cardService = inject(CartService);
    private readonly customerService = inject(CustomerService);
    private readonly hostUrl = inject(HOST_URL);
    private readonly authUrl = inject(AUTH_URL);
    readonly httpClient = inject(HttpClient);

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    signInCustomer({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<CustomerResponseDto & { cart: Cart }> {
        if (!this.cardService.value) {
            return EMPTY;
        }

        return this.httpClient.post<CustomerResponseDto & { cart: Cart }>(
            `${this.hostUrl.url}/login`,
            {
                email,
                password,
                anonymousCart: {
                    id: this.cardService.value.id,
                    typeId: 'cart',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    signUpCustomer(customer: SignupCustomer): Observable<CustomerResponseDto> {
        return this.httpClient.post<CustomerResponseDto>(
            `${this.hostUrl.url}/me/signup`,
            customer,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'text/plain',
                },
            },
        );
    }

    checkUserByEmail(email: string) {
        return this.httpClient.head(
            `${this.hostUrl.url}/customers?where=${encodeURIComponent(`email="${email}"`)}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            },
        );
    }

    createAnonymousCart(): void {
        this.httpClient
            .post<Cart>(
                `${this.hostUrl.url}/carts`,
                { currency: 'EUR', anonymousId: uuidv4() },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            )
            .subscribe(cart => {
                this.cardService.cart = cart;
            });
    }

    setProjectSettings(): void {
        this.httpClient
            .get<ProjectSettings>(
                `${this.hostUrl.url}?scope=view_project_settings:${environment.projectKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                },
            )
            .subscribe(settings => {
                this.projectSettingsService.projectSettings = settings;
            });
    }

    getPasswordFlowToken({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<AccessTokenResponseDto> {
        return this.httpClient.post<AccessTokenResponseDto>(
            `${this.authUrl.url}/oauth/${environment.projectKey}/customers/token`,
            `grant_type=password`,
            {
                headers: {
                    Authorization: `Basic ${window.btoa(`${environment.clientId}:${environment.clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    username: email,
                    password,
                    scope: environment.scopes,
                },
            },
        );
    }

    getCustomerByPasswordFlowToken(): Observable<CustomerResponseDto> {
        return this.httpClient
            .get<CustomerResponseDto>(`${this.hostUrl.url}/me`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
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
        return this.httpClient.get<CartResponseDto>(`${this.hostUrl.url}/me/carts`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    }

    getAccessToken(): Observable<AccessTokenResponseDto> {
        return this.httpClient.post<AccessTokenResponseDto>(
            `${this.authUrl.url}/oauth/${environment.projectKey}/anonymous/token`,
            `grant_type=client_credentials&scope=${environment.scopes}`,
            {
                headers: {
                    Authorization: `Basic ${window.btoa(`${environment.clientId}:${environment.clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
    }
}
