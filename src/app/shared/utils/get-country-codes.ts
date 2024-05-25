import { customList } from 'country-codes-list';
import { formatString } from './format-string';

export const getCountryCodes = () =>
    Object.entries(customList()).reduce((acc: { [key: string]: string }, country) => {
        const [code, countryName] = country;

        acc[code] = formatString(countryName);

        return acc;
    }, {});
