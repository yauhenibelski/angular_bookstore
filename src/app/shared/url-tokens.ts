import { InjectionToken } from '@angular/core';

export const BASE_URL = new InjectionToken('Base url for application', {
    providedIn: 'root',
    factory: () => ({
        key: 'host',
        url: 'https://api.europe-west1.gcp.commercetools.com',
    }),
});

export const AUTH_URL = new InjectionToken('Authorization url for application', {
    providedIn: 'root',
    factory: () => ({
        key: 'auth_url',
        url: 'https://auth.europe-west1.gcp.commercetools.com',
    }),
});
