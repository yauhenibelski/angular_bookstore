import * as countryCodes from 'country-codes-list';
import { formatString } from './format-string';

export const getCountryKey = (countryName: string): string | undefined => {
    const key = Object.entries(countryCodes.customList()).find(([, name]) => {
        return formatString(name).toLowerCase() === countryName.toLowerCase();
    });

    return key ? key[0].toUpperCase() : undefined;
};
