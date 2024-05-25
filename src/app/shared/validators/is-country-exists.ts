import { AbstractControl, ValidatorFn } from '@angular/forms';

export const isCountryExists = (countries: { [key: string]: string }): ValidatorFn => {
    const lowerCaseCountriesNames = Object.values(countries).map(countryName =>
        countryName.toLowerCase(),
    );

    return function ({ value }: AbstractControl) {
        return lowerCaseCountriesNames.includes(value.toLowerCase().trim())
            ? null
            : { isCountryExists: `such country doesn't exist` };
    };
};
