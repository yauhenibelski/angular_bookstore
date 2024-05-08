import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token-response';
import { Observable } from 'rxjs';
import { AUTH_URL } from '../url-tokens';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private access_token: string | null = null;
    private readonly httpClient = inject(HttpClient);
    private readonly authUrl = inject(AUTH_URL);

    set accessToken(token: string) {
        this.access_token = token;
    }

    get accessToken$(): Observable<AccessTokenResponseDto> {
        return this.httpClient.post<AccessTokenResponseDto>(
            `${this.authUrl.url}/oauth/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${environment.getAccessToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
    }
}
