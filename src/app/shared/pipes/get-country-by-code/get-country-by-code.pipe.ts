import { Pipe, PipeTransform } from '@angular/core';
import { getCountryByCode } from '../../utils/get-country-by-code';

@Pipe({
    name: 'getCountryByCode',
    standalone: true,
})
export class GetCountryByCodePipe implements PipeTransform {
    transform(value: string): string {
        return getCountryByCode(value);
    }
}
