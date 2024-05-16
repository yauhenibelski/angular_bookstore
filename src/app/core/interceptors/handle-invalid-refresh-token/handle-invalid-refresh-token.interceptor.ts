import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export const handleInvalidRefreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((err: unknown) => {
            const isError = err instanceof HttpErrorResponse;

            if (!(isError && err.status === 400)) {
                return throwError(() => err);
            }

            const isRefreshTokenResponse = err.url?.match(/refresh_token/);

            if (isRefreshTokenResponse) {
                return authService.getAccessAnonymousToken().pipe(
                    switchMap(() => {
                        const newRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authService.token.access}`,
                            },
                        });

                        return next(newRequest);
                    }),
                );
            }

            return throwError(() => err);
        }),
    );
};
