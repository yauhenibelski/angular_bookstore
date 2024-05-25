import { customList } from 'country-codes-list';
import { formatString } from './format-string';

export const getCountryByCode = (countryCode: string): string => {
    const country = Object.entries(customList()).find(([code]) => {
        return countryCode.toLowerCase() === code.toLowerCase();
    });

    const countryName = country ? formatString(country[1]) : '';

    return countryName;
};
