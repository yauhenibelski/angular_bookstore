import * as countryCodes from 'country-codes-list';
import { formatString } from './format-string';

export const getCountryByCode = (countryCode: string): string => {
    const country = Object.entries(countryCodes.customList()).find(([code]) => {
        return countryCode.toLowerCase() === code.toLowerCase();
    });

    const countryName = country ? formatString(country[1]) : '';

    return countryName;
};
