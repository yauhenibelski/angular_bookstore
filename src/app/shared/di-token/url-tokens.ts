import { InjectionToken } from '@angular/core';
import { environment } from '../../environment/environment';

export const HOST_URL = new InjectionToken('Host url for application', {
    providedIn: 'root',
    factory: () => ({
        key: 'host',
        url: `https://api.europe-west1.gcp.commercetools.com/${environment.projectKey}`,
    }),
});

export const AUTH_URL = new InjectionToken('Authorization url for application', {
    providedIn: 'root',
    factory: () => ({
        key: 'auth_url',
        url: 'https://auth.europe-west1.gcp.commercetools.com',
    }),
});
