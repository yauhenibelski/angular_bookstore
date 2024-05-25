import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetErrorMassagePipe } from 'src/app/shared/pipes/get-error-massage/get-error-massage.pipe';
import { hasOneCharacter } from 'src/app/shared/validators/has-least-one-character';
import { hasOneLatinCharacter } from 'src/app/shared/validators/has-one-latin-character';
import { hasSpace } from 'src/app/shared/validators/has-space';
import { isPostalCodeValid } from 'src/app/shared/validators/is-postalcode-valid';
import { isCountryExists } from 'src/app/shared/validators/is-country-exists';
import { MatInputModule } from '@angular/material/input';
import { Address } from 'src/app/interfaces/customer-response-dto';
import { getCountryCodes } from 'src/app/shared/utils/get-country-codes';

@Component({
    selector: 'app-address-form',
    standalone: true,
    imports: [
        MatFormFieldModule,
        GetErrorMassagePipe,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
    ],
    templateUrl: './address-form.component.html',
    styleUrl: './address-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {
    private readonly formBuilder = inject(FormBuilder);

    readonly countryCodes = getCountryCodes();

    getValue() {
        return this.form.getRawValue();
    }

    writeValue(address: Address | null): void {
        if (!address) {
            this.form.setValue({ city: '', country: '', streetName: '', postalCode: '' });
            this.form.markAsUntouched();

            return;
        }

        this.form.setValue({
            city: address.city,
            country: address.country,
            streetName: address.streetName,
            postalCode: address.postalCode,
        });
        this.form.markAsUntouched();
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.form.disable();

            return;
        }

        this.form.enable();
    }

    private readonly countryControl = new FormControl('', {
        validators: [hasOneLatinCharacter, isCountryExists(this.countryCodes)],
        nonNullable: true,
    });

    form = this.formBuilder.nonNullable.group({
        country: this.countryControl,
        city: new FormControl('', {
            nonNullable: true,
            validators: [hasOneLatinCharacter, hasSpace],
        }),
        streetName: new FormControl('', {
            nonNullable: true,
            validators: [hasOneCharacter, hasSpace],
        }),
        postalCode: new FormControl('', {
            validators: [isPostalCodeValid(this.countryControl, this.countryCodes)],
            nonNullable: true,
        }),
    });

    get controls() {
        return this.form.controls;
    }
}
