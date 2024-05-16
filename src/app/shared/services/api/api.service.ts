import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';
import { CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL } from '../../di-tokens/url-tokens';
import { ProjectSettingsService } from '../project-settings/project-settings.service';
import { CartService } from '../cart/cart.service';
import { Cart, CartResponseDto } from '../cart/cart.interface';
import { CustomerService } from '../customer/customer.service';
import { TOKEN_TYPE_CONTEXT } from '../../http-context-token';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly projectSettingsService = inject(ProjectSettingsService);
    private readonly customerService = inject(CustomerService);
    private readonly cardService = inject(CartService);
    private readonly httpClient = inject(HttpClient);
    private readonly baseUrl = inject(BASE_URL);

    checkUserByEmail(email: string) {
        return this.httpClient.head(
            `${this.baseUrl.host}/customers?where=${encodeURIComponent(`email="${email}"`)}`,
            {
                context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
            },
        );
    }

    createAnonymousCart(): void {
        this.httpClient
            .post<Cart>(
                `${this.baseUrl.host}/carts`,
                { currency: 'EUR', anonymousId: uuidv4() },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
                },
            )
            .subscribe(cart => {
                this.cardService.setCart(cart);
            });
    }

    setProjectSettings(): void {
        this.httpClient
            .get<ProjectSettings>(
                `${this.baseUrl.host}?scope=view_project_settings:${environment.projectKey}`,
                {
                    context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
                },
            )
            .subscribe(settings => {
                this.projectSettingsService.setProjectSettings(settings);
            });
    }

    getCustomerByPasswordFlowToken(): Observable<CustomerResponseDto> {
        return this.httpClient
            .get<CustomerResponseDto>(`${this.baseUrl.host}/me`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
            })
            .pipe(
                tap(response => {
                    this.customerService.customer = response.customer;
                }),
            );
    }

    getCartByPasswordFlowToken(): Observable<CartResponseDto> {
        return this.httpClient.get<CartResponseDto>(`${this.baseUrl.host}/me/carts`, {
            headers: {
                'Content-Type': 'application/json',
            },
            context: new HttpContext().set(TOKEN_TYPE_CONTEXT, 'Bearer'),
        });
    }
}
