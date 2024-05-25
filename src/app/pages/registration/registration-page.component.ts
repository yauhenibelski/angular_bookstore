import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectSettingsService } from 'src/app/shared/services/project-settings/project-settings.service';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { filter, map, switchMap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { isEmail } from 'src/app/shared/validators/email';
import { passwordValidators } from 'src/app/shared/validators/password';
import { hasSpace } from 'src/app/shared/validators/has-space';
import { GetErrorMassagePipe } from 'src/app/shared/pipes/get-error-massage/get-error-massage.pipe';
import { CheckUniqueEmail } from 'src/app/shared/validators/async-email-check';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SignupCustomer } from 'src/app/interfaces/signup-customer-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDateOfBirth } from 'src/app/shared/utils/format-date-of-birth';
import { getCountryCodes } from 'src/app/shared/utils/get-country-codes';
import { getCountryKey } from 'src/app/shared/utils/get-country-key';
import { hasOneLatinCharacter } from '../../shared/validators/has-one-latin-character';
import { isDate } from '../../shared/validators/date';
import { isCountryExists } from '../../shared/validators/is-country-exists';
import { isPostalCodeValid } from '../../shared/validators/is-postalcode-valid';
import { SuccessfulAccountCreationMessageComponent } from './successful-account-creation-message/successful-account-creation-message.component';
import { Address } from './interface/address';
import { hasOneCharacter } from '../../shared/validators/has-least-one-character';
import { ErrorRegistrationComponent } from './error-registration/error-registration.component';

@UntilDestroy()
@Component({
    selector: 'app-registration-page',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        GetErrorMassagePipe,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        AsyncPipe,
        MatSlideToggleModule,
        RouterLink,
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
    providers: [provideNativeDateAdapter(), CheckUniqueEmail],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
    private readonly checkUniqueEmail = inject(CheckUniqueEmail);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly apiService = inject(ApiService);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);
    private readonly projectSettingsService = inject(ProjectSettingsService);

    readonly availableCountries$ = this.projectSettingsService.projectSettings$.pipe(
        filter(projectSettings => Boolean(projectSettings)),
        map(projectSettings => projectSettings?.countries),
    );

    readonly countryCodes = getCountryCodes();

    isPasswordHide = true;

    openSnackBar(error?: unknown): void {
        const duration = 3000;
        const massage = error
            ? ErrorRegistrationComponent
            : SuccessfulAccountCreationMessageComponent;

        this.snackBar.openFromComponent(massage, { duration });
    }

    private readonly shippingAddressCountryControl = new FormControl('', {
        validators: [hasOneLatinCharacter, isCountryExists(this.countryCodes)],
        nonNullable: true,
    });

    private readonly billingAddressCountryControl = new FormControl('', {
        validators: [hasOneLatinCharacter, isCountryExists(this.countryCodes)],
        nonNullable: true,
    });

    readonly registrationForm = this.formBuilder.nonNullable.group({
        email: new FormControl('', {
            validators: [isEmail],
            asyncValidators: [this.checkUniqueEmail.validate.bind(this.checkUniqueEmail)],
            nonNullable: true,
        }),
        password: ['', [...Object.values(passwordValidators)]],
        firstName: ['', [hasOneLatinCharacter, hasSpace]],
        lastName: ['', [hasOneLatinCharacter, hasSpace]],

        addresses: this.formBuilder.nonNullable.array<FormGroup<Address>>([
            this.formBuilder.nonNullable.group({
                country: this.shippingAddressCountryControl,
                city: new FormControl('', {
                    nonNullable: true,
                    validators: [hasOneLatinCharacter, hasSpace],
                }),
                streetName: new FormControl('', {
                    nonNullable: true,
                    validators: [hasOneCharacter, hasSpace],
                }),
                postalCode: new FormControl('', {
                    validators: [
                        isPostalCodeValid(this.shippingAddressCountryControl, this.countryCodes),
                    ],
                    nonNullable: true,
                }),
            }),
            this.formBuilder.nonNullable.group({
                country: this.billingAddressCountryControl,
                city: new FormControl('', {
                    nonNullable: true,
                    validators: [hasOneLatinCharacter, hasSpace],
                }),
                streetName: new FormControl('', {
                    nonNullable: true,
                    validators: [hasOneCharacter, hasSpace],
                }),
                postalCode: new FormControl('', {
                    validators: [
                        isPostalCodeValid(this.billingAddressCountryControl, this.countryCodes),
                    ],
                    nonNullable: true,
                }),
            }),
        ]),

        dateOfBirth: ['', [isDate]],
    });

    get controls() {
        const [shippingAddress, billingAddress] = this.registrationForm.controls.addresses.controls;

        return {
            ...this.registrationForm.controls,
            shipping: { ...shippingAddress.controls },
            billingAddress: { ...billingAddress.controls },
        };
    }

    setDefaultBillingAddress(): void {
        const [shippingAddress, billingAddress] = this.registrationForm.controls.addresses.controls;
        const {
            country: shippingAddressCountry,
            city: shippingAddressCity,
            streetName: shippingAddressStreet,
            postalCode: shippingAddressPostalCode,
        } = shippingAddress.controls;
        const {
            country: billingAddressCountry,
            city: billingAddressCity,
            streetName: billingAddressStreet,
            postalCode: billingAddressPostalCode,
        } = billingAddress.controls;

        billingAddressCountry.setValue(shippingAddressCountry.value);
        billingAddressCity.setValue(shippingAddressCity.value);
        billingAddressStreet.setValue(shippingAddressStreet.value);
        billingAddressPostalCode.setValue(shippingAddressPostalCode.value);
    }

    clearBillingAddress(useAddressForBilling: boolean): void {
        if (useAddressForBilling) {
            this.setDefaultBillingAddress();
        }

        if (!useAddressForBilling) {
            const [, billingAddress] = this.registrationForm.controls.addresses.controls;

            Object.values(billingAddress.controls).forEach((formControl: FormControl) => {
                formControl.setValue('');
            });
        }
    }

    signUpCustomer(useDefaultShippingAddress: boolean, useDefaultBillingAddress: boolean): void {
        const formValue = this.registrationForm.getRawValue();
        const { email, password } = formValue;
        const addresses = [...formValue.addresses].map(address => ({
            ...address,
            ...{ country: getCountryKey(address.country) },
        }));

        const mapFormValue: SignupCustomer = {
            ...formValue,
            dateOfBirth: formatDateOfBirth(formValue.dateOfBirth),
            addresses,
            shippingAddresses: [0], // index from array address
            billingAddresses: [1], // index from array address
        };

        if (useDefaultShippingAddress) {
            mapFormValue.defaultShippingAddress = 0; // index from array address
        }

        if (useDefaultBillingAddress) {
            mapFormValue.defaultBillingAddress = 1; // index from array address
        }

        this.authService
            .signUpCustomer(mapFormValue)
            .pipe(
                untilDestroyed(this),
                switchMap(() => this.authService.getPasswordFlowToken({ email, password })),
            )
            .subscribe({
                next: () => {
                    this.openSnackBar();
                    this.authService.setLoginStatus(true);
                    this.router.navigateByUrl('/main');
                },
                error: (err: unknown) => {
                    this.openSnackBar(err);
                },
            });
    }

    getCountries(): void {
        if (!this.projectSettingsService.projectSettings) {
            this.apiService.setProjectSettings().pipe(untilDestroyed(this)).subscribe();
        }
    }
}
