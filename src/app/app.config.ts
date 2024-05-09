import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { getAccessToken } from './core/initializations/get-access-token';
import { AuthApiService } from './shared/services/auth-api/auth-api.service';
import { HostApiService } from './shared/services/host-api/host-api.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideAnimationsAsync(),
        provideHttpClient(),
        {
            provide: APP_INITIALIZER,
            useFactory: getAccessToken,
            deps: [AuthApiService, HostApiService],
            multi: true,
        },
    ],
};
