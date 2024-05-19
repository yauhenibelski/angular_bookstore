import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import {
    AccessToken,
    AccessTokenResponseDto,
    RefreshTokenResponseDto,
} from 'src/app/interfaces/access-token';
import { environment } from 'src/app/environment/environment';
import { SignupCustomer } from 'src/app/interfaces/signup-customer-request';
import { Customer, CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { accessTokenName, refreshTokenName } from '../../constants/short-names';
import { setAccessTokenInCookie } from '../../utils/set-access-token-in-cookie';
import { Cart } from '../cart/cart.interface';
import { CartService } from '../cart/cart.service';
import { ApiService } from '../api/api.service';
import { highOrderCustomTap } from '../../utils/high-order-custom-tap-operator';
import { CustomerService } from '../customer/customer.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly cartService = inject(CartService);
    private readonly apiService = inject(ApiService);
    private readonly customerService = inject(CustomerService);

    private readonly isLoginedSubject = new BehaviorSubject<boolean>(false);

    token: AccessToken = {
        access: null,
        refresh: null,
    };

    signUpCustomer(customer: SignupCustomer): Observable<CustomerResponseDto> {
        return this.httpClient
            .post<CustomerResponseDto>('/me/signup', customer, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            })
            .pipe(
                tap(({ customer }) => {
                    this.customerService.setCustomer(customer);
                }),
            );
    }

    signInCustomer({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<CustomerResponseDto & { cart: Cart }> {
        if (!this.cartService.cart) {
            return EMPTY;
        }

        return this.httpClient
            .post<CustomerResponseDto & { cart: Cart }>(
                '/login',
                {
                    email,
                    password,
                    anonymousCart: {
                        id: this.cartService.cart.id,
                        typeId: 'cart',
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .pipe(
                tap(({ customer }) => {
                    this.customerService.setCustomer(customer);
                }),
            );
    }

    hasRefreshToken(): boolean {
        return Boolean(this.token.refresh);
    }

    getAccessAnonymousToken(): Observable<AccessTokenResponseDto> {
        return this.httpClient
            .post<AccessTokenResponseDto>(
                `/oauth/${environment.projectKey}/anonymous/token`,
                `grant_type=client_credentials&scope=${environment.scopes}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            )
            .pipe(
                tap(response => {
                    this.token.access = response.access_token;
                    this.token.refresh = response.refresh_token;

                    this.setLoginStatus(false);
                    this.customerService.setCustomer(null);
                    this.cartService.setCart(null);

                    setAccessTokenInCookie(response, true);
                }),
                highOrderCustomTap(this.apiService.createAnonymousCart()),
            );
    }

    getPasswordFlowToken({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<AccessTokenResponseDto> {
        return this.httpClient
            .post<AccessTokenResponseDto>(
                `/oauth/${environment.projectKey}/customers/token`,
                `grant_type=password`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    params: {
                        username: email,
                        password,
                        scope: environment.scopes,
                    },
                },
            )
            .pipe(
                tap(passwordFlowToken => {
                    setAccessTokenInCookie(passwordFlowToken, false);
                }),
            );
    }

    updateToken(): Observable<RefreshTokenResponseDto> {
        return this.httpClient
            .post<RefreshTokenResponseDto>('/oauth/token', 'grant_type=refresh_token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    refresh_token: `${this.token.refresh}`,
                },
            })
            .pipe(
                tap(response => {
                    this.token.access = response.access_token;

                    setAccessTokenInCookie(
                        { ...response, refresh_token: this.token.refresh! },
                        !this.isLogined,
                    );
                }),
            );
    }

    setToken(cookie: { [key: string]: string }): void {
        this.token.access = cookie[accessTokenName];
        this.token.refresh = cookie[refreshTokenName];
    }

    get isLogined() {
        return this.isLoginedSubject.value;
    }

    get isLogined$() {
        return this.isLoginedSubject.asObservable();
    }

    setLoginStatus(value: boolean): void {
        this.isLoginedSubject.next(value);
    }
}
