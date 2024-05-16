import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { TOKEN_TYPE_CONTEXT } from 'src/app/shared/http-context-token';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export const setTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const tokenType = req.context.get(TOKEN_TYPE_CONTEXT);

    const basic = window.btoa(`${environment.clientId}:${environment.clientSecret}`);
    const bearer = authService.token.access;

    const newRequest = req.clone({
        setHeaders: {
            Authorization: `${tokenType} ${tokenType === 'Basic' ? basic : bearer}`,
        },
    });

    return next(newRequest);
};
