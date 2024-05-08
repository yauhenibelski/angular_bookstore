import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { getAccessToken } from './core/initializations/get-access-token';
import { AuthApiService } from './shared/auth-api-service/auth-api.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        {
            provide: APP_INITIALIZER,
            useFactory: getAccessToken,
            deps: [AuthApiService],
            multi: true,
        },
    ],
};
