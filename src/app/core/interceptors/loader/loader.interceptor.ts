import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);
    const urls: string[] = [];

    if (req.method !== 'HEAD') {
        loaderService.showLoader();
        urls.push(req.url);
    }

    return next(req).pipe(
        tap({
            next: response => {
                if (response.type === HttpEventType.Response && response.url) {
                    const index = urls.indexOf(response.url);

                    if (index !== -1) {
                        urls.splice(index, 1);
                    }

                    if (!urls.length) {
                        loaderService.hideLoader();
                    }
                }
            },
            error: (err: unknown) => {
                if (err instanceof HttpErrorResponse && err.url) {
                    const index = urls.indexOf(err.url);

                    if (index !== -1) {
                        urls.splice(index, 1);
                    }

                    if (!urls.length) {
                        loaderService.hideLoader();
                    }
                }
            },
        }),
    );
};
