import { InjectionToken } from '@angular/core';
import { environment } from '../../environment/environment';

export const BASE_URL = new InjectionToken('Url for application', {
    providedIn: 'root',
    factory: () => ({
        host: `https://api.europe-west1.gcp.commercetools.com/${environment.projectKey}`,
        auth: 'https://auth.europe-west1.gcp.commercetools.com',
    }),
});
