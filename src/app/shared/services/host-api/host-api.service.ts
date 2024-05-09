import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettings } from 'src/app/interfaces/project-settings';
import { CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { SignupCustomer } from 'src/app/interfaces/signup-customer-request';
import { Observable } from 'rxjs';
import { HOST_URL } from '../../url-tokens';
import { ProjectSettingsService } from '../project-settings/project-settings.service';

@Injectable({
    providedIn: 'root',
})
export class HostApiService {
    private accessToken: string | null = null;
    readonly httpClient = inject(HttpClient);
    private readonly hostUrl = inject(HOST_URL);
    private readonly projectSettingsService = inject(ProjectSettingsService);

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    signUpCustomer$(customer: SignupCustomer): Observable<CustomerResponseDto> {
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

    setProjectSettings(): void {
        this.httpClient
            .get<ProjectSettings>(this.hostUrl.url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(settings => {
                const { envProjectSettings$ } = this.projectSettingsService;

                envProjectSettings$.next(settings);
            });
    }
}
