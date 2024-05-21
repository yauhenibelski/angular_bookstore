import { AbstractControl, ValidatorFn } from '@angular/forms';

export const hasOneCharacter: ValidatorFn = (control: AbstractControl) => {
    return !control.value.match(/.+$/) ? { hasUppercaseLetter: 'at least one character' } : null;
};
