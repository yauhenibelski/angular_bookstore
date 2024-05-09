import { AbstractControl, ValidatorFn } from '@angular/forms';
import { hasSpace } from './has-space';

export const passwordValidators: { [key: string]: ValidatorFn } = {
    minCharacters(control: AbstractControl) {
        return control.value.length < 8 ? { minCharacters: 'minimum 8 characters' } : null;
    },
    hasUppercaseLetter(control: AbstractControl) {
        return !control.value.match(/[A-Z]/)
            ? { hasUppercaseLetter: 'minimum one uppercase letter' }
            : null;
    },
    hasLowerCaseLetter(control: AbstractControl) {
        return !control.value.match(/[a-z]/)
            ? { hasUppercaseLetter: 'minimum one lowercase letter' }
            : null;
    },
    hasOneNumber(control: AbstractControl) {
        return !control.value.match(/[0-9]/) ? { hasUppercaseLetter: 'minimum one number' } : null;
    },
    hasSpace,
};
