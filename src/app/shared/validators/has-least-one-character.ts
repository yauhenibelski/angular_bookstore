import { AbstractControl, ValidatorFn } from '@angular/forms';

export const hasOneCharacter: ValidatorFn = (control: AbstractControl) => {
    return !control.value.trim().length ? { hasUppercaseLetter: 'at least one character' } : null;
};
