import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';
import { Customer } from 'src/app/interfaces/customer-response-dto';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { v4 as uuidv4 } from 'uuid';
import { Category, CategoryDto } from 'src/app/interfaces/category';
import { Product, ProductsDto } from 'src/app/interfaces/product';
import { ProjectSettingsService } from '../project-settings/project-settings.service';
import { CartService } from '../cart/cart.service';
import { Cart, CartResponseDto } from '../cart/cart.interface';
import { CustomerService } from '../customer/customer.service';
import { Action } from './action.type';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly projectSettingsService = inject(ProjectSettingsService);
    private readonly customerService = inject(CustomerService);
    private readonly cartService = inject(CartService);
    private readonly httpClient = inject(HttpClient);

    updateCustomer(
        action: Action,
        payload: { [key: string]: unknown },
        extraAction?: { [key: string]: unknown },
    ): Observable<Customer> {
        return this.httpClient
            .post<Customer>('/me', {
                version: this.customerService.customer?.version,
                actions: [
                    {
                        action,
                        ...payload,
                    },
                    extraAction,
                ].filter(Boolean),
            })
            .pipe(tap(customer => this.customerService.setCustomer(customer)));
    }

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
                    this.cartService.setCart(cart);
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

    getCustomerByPasswordFlowToken(): Observable<Customer> {
        return this.httpClient
            .get<Customer>('/me', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .pipe(
                tap(customer => {
                    this.customerService.setCustomer(customer);
                }),
            );
    }

    getCartByPasswordFlowToken(): Observable<CartResponseDto> {
        return this.httpClient
            .get<CartResponseDto>('/me/carts', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .pipe(
                tap(cartRes => {
                    const cart = cartRes.results.reverse()[0] ?? null;

                    this.cartService.setCart(cart);
                }),
            );
    }

    changePassword(currentPassword: string, newPassword: string): Observable<Customer> {
        return this.httpClient.post<Customer>('/customers/password', {
            id: this.customerService.customer?.id,
            version: this.customerService.customer?.version,
            currentPassword,
            newPassword,
        });
    }

    getCategories(id = ''): Observable<CategoryDto> {
        return id
            ? this.httpClient.get<CategoryDto>(
                  `/categories?where=parent(${encodeURIComponent(`id="${id}"`)})`,
              )
            : this.httpClient.get<CategoryDto>('/categories?where=not(parent%20is%20defined)');
    }

    getCategoryByKey(key: string): Observable<Category> {
        return this.httpClient.get<Category>(`/categories/key=${key}`);
    }

    getProductsByCategoryID(id: string): Observable<Product[]> {
        return this.httpClient
            .get<ProductsDto>(
                `/product-projections/search?filter=${encodeURIComponent(`categories.id:"${id}"`)}`,
            )
            .pipe(map(({ results }) => results));
    }

    getProducts(): Observable<Product[]> {
        return this.httpClient
            .get<ProductsDto>('/product-projections/search')
            .pipe(map(({ results }) => results));
    }
}
