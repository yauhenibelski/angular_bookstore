import { AbstractControl, ValidatorFn } from '@angular/forms';

export const hasOneLatinCharacter: ValidatorFn = (control: AbstractControl) => {
    return !control.value.match(/^[a-zA-Z]+$/)
        ? { hasUppercaseLetter: 'at least one latin character' }
        : null;
};
