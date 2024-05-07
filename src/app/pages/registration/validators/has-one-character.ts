import { AbstractControl, ValidatorFn } from '@angular/forms';

export const hasOneCharacter: ValidatorFn = (control: AbstractControl) => {
    return !control.value.match(/[a-zA-Z]/)
        ? { hasUppercaseLetter: 'at least one character' }
        : null;
};
