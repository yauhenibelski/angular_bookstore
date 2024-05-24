import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { isEmail } from 'src/app/shared/validators/email';
import { CheckUniqueEmail } from 'src/app/shared/validators/async-email-check';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Action } from 'src/app/shared/services/api/action.type';
import { formatDateOfBirth } from 'src/app/shared/utils/format-date-of-birth';
import { Address, Addresses } from 'src/app/interfaces/customer-response-dto';
import { passwordValidators } from 'src/app/shared/validators/password';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { getCountryByCode } from '../registration/utils/get-country-by-code';
import { AddressFormComponent } from './address-form/address-form.component';
import { getCountryKey } from '../registration/utils/get-country-key';

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
        GetErrorMassagePipe,
        AddressFormComponent,
    ],
    providers: [provideNativeDateAdapter(), CheckUniqueEmail],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
    private readonly apiService = inject(ApiService);
    private readonly authService = inject(AuthService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly customerService = inject(CustomerService);
    private readonly checkUniqueEmail = inject(CheckUniqueEmail);
    private readonly changeDetector = inject(ChangeDetectorRef);

    readonly customer$ = this.customerService.customer$;

    isNewPasswordHide = true;
    isCurrentPasswordHide = true;

    get addresses(): Addresses | null {
        return this.customerService.addresses;
    }

    getCountryByCode = getCountryByCode; // todo: replace to pipe

    form = this.formBuilder.nonNullable.group({
        firstName: ['', [hasOneLatinCharacter, hasSpace]],
        lastName: ['', [hasOneLatinCharacter, hasSpace]],
        dateOfBirth: ['', [isDate]],
        currentPassword: ['', [...Object.values(passwordValidators)]],
        newPassword: ['', [...Object.values(passwordValidators)]],
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
        }

        if (action === 'setLastName') {
            payload = { lastName };
        }

        if (action === 'changeEmail') {
            payload = { email };
        }

        if (action === 'setDateOfBirth') {
            payload = { dateOfBirth: formatDateOfBirth(dateOfBirth) };
        }

        if (!payload) {
            return;
        }

        this.resetControls();

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

    updateAddress(address: Address, id: string | undefined): void {
        if (!id) {
            return;
        }

        const payload = {
            addressId: id,
            address: {
                streetName: address.streetName,
                postalCode: address.postalCode,
                city: address.city,
                country: getCountryKey(address.country),
            },
        };

        this.apiService
            .updateCustomer('changeAddress', payload)
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

    resetControls(): void {
        Object.values(this.controls).forEach(control => {
            control.reset();
            control.markAsUntouched();
        });
    }

    changePassword(): void {
        const { newPassword, currentPassword } = this.form.getRawValue();

        this.apiService
            .changePassword(currentPassword, newPassword)
            .pipe(
                untilDestroyed(this),
                switchMap(({ email }) =>
                    this.authService.getPasswordFlowToken({ email, password: newPassword }),
                ),
            )
            .subscribe({
                next: () => {
                    console.info('show ok message');
                },
                error: () => {
                    console.info('show err message');
                },
            });

        this.resetControls();
    }
}
