import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getErrorMassage',
    standalone: true,
})
export class GetErrorMassagePipe implements PipeTransform {
    transform(errorObj: { [key: string]: string }): string {
        return Object.values(errorObj)[0];
    }
}
