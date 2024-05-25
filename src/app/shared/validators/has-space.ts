import { AbstractControl, ValidatorFn } from '@angular/forms';

export const hasSpace: ValidatorFn = (control: AbstractControl) => {
    return control.value.match(/\s/) ? { hasUppercaseLetter: 'without spaces' } : null;
};
