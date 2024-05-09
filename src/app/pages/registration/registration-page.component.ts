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
import { isEmail } from './validators/email';
import { passwordValidators } from './validators/password';
import { GetErrorMassagePipe } from './pipes/get-error-massage.pipe';
import { hasOneCharacter } from './validators/has-one-character';
import { hasSpace } from './validators/has-space';
import { isDate } from './validators/date';
import { isCountryExists } from './validators/is-country-exists';
import { isPostalCodeValid } from './validators/is-postalcode-valid';
import { getCountryCodes } from './utils/get-country-codes';

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
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
    // private readonly hostApiService = inject(HostApiService);
    readonly countryCodes = getCountryCodes();
    isPasswordHide = true;

    readonly availableCountries$ = inject(ProjectSettingsService).projectSettings$.pipe(
        filter(projectSettings => Boolean(projectSettings)),
        map(projectSettings => projectSettings?.countries),
    );

    private readonly countryControl = new FormControl('', {
        validators: [hasOneCharacter, isCountryExists(this.countryCodes)],
    });

    readonly registrationForm = new FormGroup({
        country: this.countryControl,
        email: new FormControl('', [isEmail]),
        shippingAddress: new FormControl('', [isEmail]),
        password: new FormControl('', [...Object.values(passwordValidators)]),
        firstName: new FormControl('', [hasOneCharacter, hasSpace]),
        lastName: new FormControl('', [hasOneCharacter, hasSpace]),
        city: new FormControl('', [hasOneCharacter, hasSpace]),
        street: new FormControl('', [hasOneCharacter, hasSpace]),
        postalCode: new FormControl('', [
            isPostalCodeValid(this.countryControl, this.countryCodes),
        ]),
        date: new FormControl('', [isDate]),
    });

    readonly controls = this.registrationForm.controls;

    ngOnInit(): void {
        // ----- commented until crosscheck -----
        // this.hostApiService.setProjectSettings();
        console.info();
    }
}
