import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import * as postalCodes from 'postal-codes-js';

export const isPostalCodeValid = (
    controlCountryName: FormControl,
    countries: { [key: string]: string },
): ValidatorFn => {
    return function (control: AbstractControl) {
        const country = Object.entries(countries).find(([, name]) => {
            return controlCountryName.value.toLowerCase() === name.toLowerCase();
        });
        const countryCode = country ? country[0] : undefined;
        const err = { isCountryExists: `invalid postal code` };

        if (!countryCode) {
            return err;
        }

        return typeof postalCodes.validate(countryCode, control.value) === 'boolean' ? null : err;
    };
};
