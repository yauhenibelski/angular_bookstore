import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { getAccessToken } from './core/initializations/get-access-token';
import { ApiService } from './shared/services/api/api.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideAnimationsAsync(),
        provideHttpClient(),
        {
            provide: APP_INITIALIZER,
            useFactory: getAccessToken,
            deps: [ApiService],
            multi: true,
        },
    ],
};
