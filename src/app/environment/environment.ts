import { Environment } from './environment.interface';

export const environment: Environment = {
    projectSettings: {
        key: '',
        name: '',
        countries: [],
        currencies: [],
        languages: [],
        createdAt: '',
        createdBy: undefined,
        lastModifiedAt: undefined,
        lastModifiedBy: undefined,
        trialUntil: '',
        messages: undefined,
        carts: undefined,
        shoppingLists: undefined,
        version: 0,
        searchIndexing: undefined,
    },
    clientSecret: 'LdVcGWqtkJ-vLKpkjKvHKWMrhxZ9ic5W',
    clientId: 'Sa4hfpMf0ZggcaaIvm1pkPBd',
    getAccessToken() {
        return window.btoa(`${this.clientId}:${this.clientSecret}`);
    },
};
