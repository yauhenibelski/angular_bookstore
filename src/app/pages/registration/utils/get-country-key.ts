import { customList } from 'country-codes-list';
import { formatString } from './format-string';

export const getCountryKey = (countryName: string): string => {
    const key = Object.entries(customList()).find(([, name]) => {
        return formatString(name).toLowerCase() === countryName.toLowerCase();
    });

    return key ? key[0].toUpperCase() : '';
};
