import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';
import { Customer } from 'src/app/interfaces/customer-response-dto';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Category, CategoryDto } from 'src/app/interfaces/category';
import { ProductDto, ProductsDto } from 'src/app/interfaces/product';
import { ProjectSettingsService } from '../project-settings/project-settings.service';
import { CustomerService } from '../customer/customer.service';
import { Action } from './action.type';
import { IS_FILTER_DISABLED } from './http-context-token';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly projectSettingsService = inject(ProjectSettingsService);
    private readonly customerService = inject(CustomerService);
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

    getProducts(): Observable<ProductsDto> {
        return this.httpClient.get<ProductsDto>(`/product-projections/search`);
    }

    getProductByKey(key: string): Observable<ProductDto> {
        return this.httpClient.get<ProductDto>(`/products/key=${key}`);
    }

    searchProduct(text: string): Observable<ProductsDto> {
        return this.httpClient.get<ProductsDto>(
            `/product-projections/search?text.en=*${text}*&fuzzy=true&fuzzyLevel=2`,
            {
                context: new HttpContext().set(IS_FILTER_DISABLED, true),
            },
        );
    }
}
