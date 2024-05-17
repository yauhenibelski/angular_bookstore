import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { BASE_URL } from 'src/app/shared/di-tokens/url-tokens';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export const setUrlInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const baseUrl = inject(BASE_URL);
    const isAuthRequest = req.url.startsWith('/oauth/');

    const basic = `Basic ${window.btoa(`${environment.clientId}:${environment.clientSecret}`)}`;
    const bearer = `Bearer ${authService.token.access}`;

    const newRequest = req.clone({
        url: (isAuthRequest ? baseUrl.auth : baseUrl.host) + req.url,
        setHeaders: {
            Authorization: isAuthRequest ? basic : bearer,
        },
    });

    return next(newRequest);
};
