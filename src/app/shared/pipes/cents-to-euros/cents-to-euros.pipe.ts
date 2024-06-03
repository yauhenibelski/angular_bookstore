import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'centsToEuros',
    standalone: true,
})
export class CentsToEurosPipe implements PipeTransform {
    transform(price?: number): number | undefined {
        return price && price / 100;
    }
}
