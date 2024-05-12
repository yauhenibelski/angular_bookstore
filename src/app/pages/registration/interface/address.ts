import { FormControl } from '@angular/forms';

export interface Address {
    country: FormControl<string>;
    city: FormControl<string>;
    streetName: FormControl<string>;
    postalCode: FormControl<string>;
}
