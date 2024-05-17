import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);

    if (req.method !== 'HEAD') {
        loaderService.showLoader();
    }

    return next(req).pipe(
        tap({
            next: response => {
                if (response.type === HttpEventType.Response) {
                    loaderService.hideLoader();
                }
            },
            complete: () => {
                loaderService.hideLoader();
            },
            error: (err: unknown) => {
                if (err instanceof HttpErrorResponse) {
                    loaderService.hideLoader();
                }
            },
        }),
    );
};
