import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideNativeDateAdapter } from '@angular/material/core';
import { hasOneLatinCharacter } from 'src/app/shared/validators/has-one-latin-character';
import { hasSpace } from 'src/app/shared/validators/has-space';
import { GetErrorMassagePipe } from 'src/app/shared/pipes/get-error-massage/get-error-massage.pipe';
import { isDate } from 'src/app/shared/validators/date';
import { Addresses } from 'src/app/interfaces/customer-response-dto';
import { filter, map } from 'rxjs';
import { isEmail } from 'src/app/shared/validators/email';
import { CheckUniqueEmail } from 'src/app/shared/validators/async-email-check';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Action } from 'src/app/shared/services/api/action.type';
import { formatDateOfBirth } from 'src/app/shared/utils/format-date-of-birth';
import { AddressFilterPipe } from './pipe/address-filter/address-filter.pipe';
import { getCountryByCode } from '../registration/utils/get-country-by-code';

@UntilDestroy()
@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        AddressFilterPipe,
        GetErrorMassagePipe,
    ],
    providers: [provideNativeDateAdapter(), CheckUniqueEmail],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly customerService = inject(CustomerService);
    private readonly checkUniqueEmail = inject(CheckUniqueEmail);

    readonly customer$ = this.customerService.customer$;

    getCountryByCode = getCountryByCode; // todo: replace to pipe

    form = this.formBuilder.nonNullable.group({
        firstName: ['', [hasOneLatinCharacter, hasSpace]],
        lastName: ['', [hasOneLatinCharacter, hasSpace]],
        dateOfBirth: ['', [isDate]],
        address: this.formBuilder.array<Omit<Addresses, 'id'>>([]),
        email: new FormControl('', {
            validators: [isEmail],
            asyncValidators: [this.checkUniqueEmail.validate.bind(this.checkUniqueEmail)],
            nonNullable: true,
        }),
    });

    get controls() {
        return this.form.controls;
    }

    updateCustomer(action: Action): void {
        const { firstName, lastName, email, dateOfBirth } = this.form.getRawValue();

        let payload: { [key: string]: unknown } | null = null;

        if (action === 'setFirstName') {
            payload = { firstName };

            this.controls.firstName.reset();
            this.controls.firstName.markAsUntouched();
        }

        if (action === 'setLastName') {
            payload = { lastName };

            this.controls.lastName.reset();
            this.controls.lastName.markAsUntouched();
        }

        if (action === 'changeEmail') {
            payload = { email };

            this.controls.email.reset();
            this.controls.email.markAsUntouched();
        }

        if (action === 'setDateOfBirth') {
            payload = { dateOfBirth: formatDateOfBirth(dateOfBirth) };

            this.controls.dateOfBirth.reset();
            this.controls.dateOfBirth.markAsUntouched();
        }

        if (!payload) {
            return;
        }

        this.apiService
            .updateCustomer(action, payload)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: customer => {
                    this.customerService.setCustomer(customer);
                    console.info('show ok message');
                },
                error: () => {
                    console.info('show err message');
                },
            });
    }

    ngOnInit(): void {
        this.updateAddress();
    }

    updateAddress(): void {
        this.customer$
            .pipe(
                untilDestroyed(this),
                filter(Boolean),
                map(({ addresses }) => addresses),
            )
            .subscribe(addresses => {
                const mapAddresses = [...addresses].map(
                    ({ city, country, postalCode, streetName }) => ({
                        country: getCountryByCode(country),
                        city,
                        postalCode,
                        streetName,
                    }),
                );
                const addressesForm = this.formBuilder.array(mapAddresses);

                this.form.setControl('address', addressesForm);
            });
    }
}
