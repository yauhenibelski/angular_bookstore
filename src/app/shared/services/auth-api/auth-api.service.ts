import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token-response';
import { Observable } from 'rxjs';
import { AUTH_URL } from '../../url-tokens';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private accessToken: string | null = null;
    private readonly httpClient = inject(HttpClient);
    private readonly authUrl = inject(AUTH_URL);

    setAccessToken(token: string) {
        this.accessToken = token;
    }

    get accessToken$(): Observable<AccessTokenResponseDto> {
        return this.httpClient.post<AccessTokenResponseDto>(
            `${this.authUrl.url}/oauth/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${window.btoa(`${environment.clientId}:${environment.clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
    }
}
