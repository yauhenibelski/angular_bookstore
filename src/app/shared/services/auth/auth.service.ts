import { HttpClient, HttpContext } from '@angular/common/http';
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
import { BASE_URL } from '../../di-tokens/url-tokens';
import { accessTokenName, refreshTokenName } from '../../constants/short-names';
import { setAccessTokenInCookie } from '../../utils/set-access-token-in-cookie';
import { Cart } from '../cart/cart.interface';
import { CartService } from '../cart/cart.service';
import { TOKEN_TYPE_CONTEXT } from '../../http-context-token';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly cardService = inject(CartService);
    private readonly baseUrl = inject(BASE_URL);

    private readonly isLoginedSubject = new BehaviorSubject<boolean>(false);

    token: AccessToken = {
        access: null,
        refresh: null,
    };

    signUpCustomer(customer: SignupCustomer): Observable<CustomerResponseDto> {
        return this.httpClient.post<CustomerResponseDto>(
            `${this.baseUrl.host}/me/signup`,
            customer,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
                context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
            },
        );
    }

    signInCustomer({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<CustomerResponseDto & { cart: Cart }> {
        if (!this.cardService.cart) {
            return EMPTY;
        }

        return this.httpClient.post<CustomerResponseDto & { cart: Cart }>(
            `${this.baseUrl.host}/login`,
            {
                email,
                password,
                anonymousCart: {
                    id: this.cardService.cart.id,
                    typeId: 'cart',
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
            },
        );
    }

    hasRefreshToken(): boolean {
        return Boolean(this.token.refresh);
    }

    getAccessAnonymousToken(): Observable<AccessTokenResponseDto> {
        return this.httpClient
            .post<AccessTokenResponseDto>(
                `${this.baseUrl.auth}/oauth/${environment.projectKey}/anonymous/token`,
                `grant_type=client_credentials&scope=${environment.scopes}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Basic'),
                },
            )
            .pipe(
                tap(response => {
                    this.token.access = response.access_token;
                    this.token.refresh = response.refresh_token;

                    this.setLoginStatus(false);

                    setAccessTokenInCookie(response, true);
                }),
            );
    }

    getPasswordFlowToken({
        email,
        password,
    }: Pick<Customer, 'email' | 'password'>): Observable<AccessTokenResponseDto> {
        return this.httpClient.post<AccessTokenResponseDto>(
            `${this.baseUrl.auth}/oauth/${environment.projectKey}/customers/token`,
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
                context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Basic'),
            },
        );
    }

    updateToken(): Observable<RefreshTokenResponseDto> {
        return this.httpClient
            .post<RefreshTokenResponseDto>(
                `${this.baseUrl.auth}/oauth/token`,
                'grant_type=refresh_token',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    params: {
                        refresh_token: `${this.token.refresh}`,
                    },
                    context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Basic'),
                },
            )
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

    get isLogined$(): Observable<boolean> {
        return this.isLoginedSubject.asObservable();
    }

    setLoginStatus(value: boolean) {
        this.isLoginedSubject.next(value);
    }
}
