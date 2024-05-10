import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { filter, map } from 'rxjs';
// import { HostApiService } from 'src/app/shared/services/host-api/host-api.service';
import { isEmail } from 'src/app/shared/form-validators/email';
import { passwordValidators } from 'src/app/shared/form-validators/password';
import { hasSpace } from 'src/app/shared/form-validators/has-space';
import { GetErrorMassagePipe } from 'src/app/shared/pipes/get-error-massage/get-error-massage.pipe';
import { hasOneCharacter } from './validators/has-one-character';
import { isDate } from './validators/date';
import { isCountryExists } from './validators/is-country-exists';
import { isPostalCodeValid } from './validators/is-postalcode-valid';
import { getCountryCodes } from './utils/get-country-codes';
import { getCountryKey } from './utils/get-country-key';
import { SuccessfulAccountCreationMessageComponent } from './successful-account-creation-message/successful-account-creation-message.component';

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
        MatButtonModule,
        MatDialogModule,
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
    readonly hostApiService = inject(HostApiService);
    readonly router = inject(Router);
    readonly dialog = inject(MatDialog);
    readonly countryCodes = getCountryCodes();
    isPasswordHide = true;

    openDialog() {
        const dialogRef = this.dialog.open(SuccessfulAccountCreationMessageComponent);

        dialogRef.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/books');
        });
    }

    readonly availableCountries$ = inject(ProjectSettingsService).projectSettings$.pipe(
        filter(projectSettings => Boolean(projectSettings)),
        map(projectSettings => projectSettings?.countries),
    );

    private readonly shippingAddressCountryControl = new FormControl('', {
        validators: [hasOneCharacter, isCountryExists(this.countryCodes)],
    });

    private readonly billingAddressCountryControl = new FormControl('', {
        validators: [hasOneCharacter, isCountryExists(this.countryCodes)],
    });

    readonly registrationForm = new FormGroup({
        email: new FormControl('', [isEmail]),
        password: new FormControl('', [...Object.values(passwordValidators)]),
        firstName: new FormControl('', [hasOneCharacter, hasSpace]),
        lastName: new FormControl('', [hasOneCharacter, hasSpace]),

        shippingAddressCountry: this.shippingAddressCountryControl,
        shippingAddressCity: new FormControl('', [hasOneCharacter, hasSpace]),
        shippingAddressStreet: new FormControl('', [hasOneCharacter, hasSpace]),
        shippingAddressPostalCode: new FormControl('', [
            isPostalCodeValid(this.shippingAddressCountryControl, this.countryCodes),
        ]),

        billingAddressCountry: this.billingAddressCountryControl,
        billingAddressCity: new FormControl('', [hasOneCharacter, hasSpace]),
        billingAddressStreet: new FormControl('', [hasOneCharacter, hasSpace]),
        billingAddressPostalCode: new FormControl('', [
            isPostalCodeValid(this.billingAddressCountryControl, this.countryCodes),
        ]),
        date: new FormControl('', [isDate]),
    });

    readonly controls = this.registrationForm.controls;

    ngOnInit(): void {
        // ----- commented until crosscheck -----
        // this.hostApiService.setProjectSettings();
        console.info();
    }

    signUpCustomer(useAddressForBilling: boolean): void {
        this.hostApiService
            .signUpCustomer$({
                email: this.registrationForm.value.email!,
                password: this.registrationForm.value.password!,
                lastName: this.registrationForm.value.lastName!,
                firstName: this.registrationForm.value.firstName!,
                defaultShippingAddress: 1,
                defaultBillingAddress: Number(useAddressForBilling),
                dateOfBirth: new Date(this.registrationForm.value.date!).toJSON().slice(0, 10),
                addresses: [
                    {
                        city: this.registrationForm.value.billingAddressCity!,
                        country: getCountryKey(this.registrationForm.value.billingAddressCountry!)!,
                        streetName: this.registrationForm.value.billingAddressStreet!,
                        postalCode: this.registrationForm.value.billingAddressPostalCode!,
                    },
                    {
                        city: this.registrationForm.value.shippingAddressCity!,
                        country: getCountryKey(
                            this.registrationForm.value.shippingAddressCountry!,
                        )!,
                        streetName: this.registrationForm.value.shippingAddressStreet!,
                        postalCode: this.registrationForm.value.shippingAddressPostalCode!,
                    },
                ],
            })
            .subscribe(() => {
                this.openDialog();
            });
    }
}
