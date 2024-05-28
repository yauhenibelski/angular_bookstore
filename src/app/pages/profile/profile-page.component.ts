import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetCountryByCodePipe } from 'src/app/shared/pipes/get-country-by-code/get-country-by-code.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { getCountryKey } from 'src/app/shared/utils/get-country-key';
import { AddressFormComponent } from './address-form/address-form.component';
import { RedirectToAuthorizationComponent } from './redirect-to-authorization/redirect-to-authorization.component';

@UntilDestroy()
@Component({
    selector: 'app-profile-page',
    standalone: true,
    providers: [provideNativeDateAdapter(), CheckUniqueEmail],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        MatSlideToggleModule,
        GetCountryByCodePipe,
        RedirectToAuthorizationComponent,
    ],
})
export class ProfilePageComponent {
    private readonly apiService = inject(ApiService);
    private readonly authService = inject(AuthService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly customerService = inject(CustomerService);
    private readonly checkUniqueEmail = inject(CheckUniqueEmail);
    private readonly snackBar = inject(MatSnackBar);

    readonly customer$ = this.customerService.customer$;

    isNewPasswordHide = true;
    isCurrentPasswordHide = true;

    get addresses(): Addresses | null {
        return this.customerService.addresses;
    }

    openSnackBar(error?: HttpErrorResponse): void {
        const massage = error ? error.error['message'] || 'Editing error' : 'Successfully changed';

        this.snackBar.open(`${massage}`, undefined, {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: error ? 'snack-bar-err' : 'snack-bar-success',
        });
    }

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
                next: () => {
                    this.openSnackBar();
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err);
                    }
                },
            });
    }

    updateAddress(
        address: Address,
        addressId: string | undefined,
        type: 'shipping' | 'billing',
        setDefault: boolean,
    ): void {
        const defaultAddressAction =
            type === 'shipping' ? 'setDefaultShippingAddress' : 'setDefaultBillingAddress';

        const setDefaultAddressPayload = setDefault
            ? {
                  action: defaultAddressAction,
                  addressId,
              }
            : undefined;

        const payload = {
            addressId,
            address: {
                streetName: address.streetName,
                postalCode: address.postalCode,
                city: address.city,
                country: getCountryKey(address.country),
            },
        };

        this.apiService
            .updateCustomer('changeAddress', payload, setDefaultAddressPayload)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.openSnackBar();
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err);
                    }
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
                    this.openSnackBar();
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err);
                    }
                },
            });

        this.resetControls();
    }

    addAddress(address: Address, type: 'shipping' | 'billing', setDefault: boolean): void {
        const action = type === 'shipping' ? 'addShippingAddressId' : 'addBillingAddressId';
        const defaultAddressAction =
            type === 'shipping' ? 'setDefaultShippingAddress' : 'setDefaultBillingAddress';

        let lastIdIndex: number;
        let addressId: string;

        const payload = {
            address: {
                streetName: address.streetName,
                postalCode: address.postalCode,
                city: address.city,
                country: getCountryKey(address.country),
            },
        };

        this.apiService
            .updateCustomer('addAddress', payload)
            .pipe(
                untilDestroyed(this),
                switchMap(({ addresses }) => {
                    lastIdIndex = addresses.length - 1;
                    addressId = addresses[lastIdIndex].id!;

                    const setDefaultAddressPayload = setDefault
                        ? {
                              action: defaultAddressAction,
                              addressId,
                          }
                        : undefined;

                    return this.apiService.updateCustomer(
                        action,
                        { addressId },
                        setDefaultAddressPayload,
                    );
                }),
            )
            .subscribe({
                next: () => {
                    this.openSnackBar();
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err);
                    }
                },
            });
    }

    removeAddress(addressId: string): void {
        this.apiService
            .updateCustomer('removeAddress', {
                addressId,
            })
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.openSnackBar();
                },
                error: (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this.openSnackBar(err);
                    }
                },
            });
    }
}
