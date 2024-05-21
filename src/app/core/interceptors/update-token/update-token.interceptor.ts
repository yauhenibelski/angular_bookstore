import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export const updateTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((err: unknown) => {
            const isError = err instanceof HttpErrorResponse;

            if (!(isError && err.status === 401)) {
                return throwError(() => err);
            }

            if (authService.hasRefreshToken()) {
                return authService.updateToken().pipe(
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
        }),
    );
};
