import { AbstractControl, ValidatorFn } from '@angular/forms';

export const isDate: ValidatorFn = (control: AbstractControl) => {
    const err = { isDate: 'invalid date' };
    const biggerDateErr = { isDate: 'date too big' };
    const minEgeDateErr = { isDate: 'must be over 13 years old' };

    if (!control.value) {
        return err;
    }

    const currentDate = new Date(control.value);
    const dateNow = new Date(Date.now());

    const isCurrentDateBiggerThenDateNow =
        Date.parse(currentDate.toString()) >
        (dateNow.setFullYear(dateNow.getFullYear() - 13), Date.parse(dateNow.toString()));

    if (isCurrentDateBiggerThenDateNow) {
        return minEgeDateErr;
    }

    const isCurrentDateBiggerThenMaxLiveAge =
        (currentDate.setFullYear(currentDate.getFullYear() + 100),
        Date.parse(currentDate.toString())) < Date.parse(dateNow.toString());

    if (isCurrentDateBiggerThenMaxLiveAge) {
        return biggerDateErr;
    }

    return null;
};
