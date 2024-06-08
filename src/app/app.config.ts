import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withHashLocation,
    withPreloading,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './router/app.routes';
import { getAccessToken } from './core/initializations/get-access-token';
import { ApiService } from './shared/services/api/api.service';
import { loaderInterceptor } from './core/interceptors/loader/loader.interceptor';
import { AuthService } from './shared/services/auth/auth.service';
import { updateTokenInterceptor } from './core/interceptors/update-token/update-token.interceptor';
import { setUrlInterceptor } from './core/interceptors/set-url/set-url.interceptor';
import { handleInvalidRefreshTokenInterceptor } from './core/interceptors/handle-invalid-refresh-token/handle-invalid-refresh-token.interceptor';
import { setFilterValueInterceptor } from './core/interceptors/set-filter-value/set-filter-value.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withHashLocation(),
        ),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([
                setFilterValueInterceptor,
                setUrlInterceptor,
                updateTokenInterceptor,
                handleInvalidRefreshTokenInterceptor,
                loaderInterceptor,
            ]),
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: getAccessToken,
            deps: [ApiService, AuthService],
            multi: true,
        },
    ],
};
