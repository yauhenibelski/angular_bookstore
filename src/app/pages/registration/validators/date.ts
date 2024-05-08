import { AbstractControl, ValidatorFn } from '@angular/forms';

export const isDate: ValidatorFn = (control: AbstractControl) => {
    const err = { isDate: 'invalid date' };

    if (!control.value) {
        return err;
    }

    const currentDate = new Date(control.value);
    const dateNow = new Date(Date.now());

    const isCurrentDateBiggerThenDateNow =
        Date.parse(currentDate.toString()) > Date.parse(dateNow.toString());

    if (isCurrentDateBiggerThenDateNow) {
        return err;
    }

    const isCurrentDateBiggerThenMaxLiveAge =
        (currentDate.setFullYear(currentDate.getFullYear() + 100),
        Date.parse(currentDate.toString())) < Date.parse(dateNow.toString());

    if (isCurrentDateBiggerThenMaxLiveAge) {
        return err;
    }

    return null;
};
