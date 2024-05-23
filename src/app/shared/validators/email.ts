import { AbstractControl, ValidatorFn } from '@angular/forms';

export const isEmail: ValidatorFn = (control: AbstractControl) => {
    return control.value.match(/^(\w){2,}@(\w){2,}\.[a-z]{2,}$/)
        ? null
        : { isEmail: 'invalid email' };
};
