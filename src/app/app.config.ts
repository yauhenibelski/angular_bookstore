import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './router/app.routes';
import { getAccessToken } from './core/initializations/get-access-token';
import { ApiService } from './shared/services/api/api.service';
import { loaderInterceptor } from './core/interceptors/loader/loader.interceptor';
import { AuthService } from './shared/services/auth/auth.service';
import { CartService } from './shared/services/cart/cart.service';
import { updateTokenInterceptor } from './core/interceptors/update-token/update-token.interceptor';
import { setTokenInterceptor } from './core/interceptors/set-token/set-token.interceptor';
import { handleInvalidRefreshTokenInterceptor } from './core/interceptors/handle-invalid-refresh-token/handle-invalid-refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([
                setTokenInterceptor,
                loaderInterceptor,
                updateTokenInterceptor,
                handleInvalidRefreshTokenInterceptor,
            ]),
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: getAccessToken,
            deps: [ApiService, AuthService, CartService],
            multi: true,
        },
    ],
};
