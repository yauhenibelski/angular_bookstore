import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
    NoopAnimationsModule,
    BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectSettingsService } from 'src/app/shared/services/project-settings/project-settings.service';
import { of } from 'rxjs';
import { CustomerResponseDto } from 'src/app/interfaces/customer-response-dto';
import { RegistrationPageComponent } from './registration-page.component';
import { AccessTokenResponseDto } from '../../interfaces/access-token';
import { ErrorRegistrationComponent } from './error-registration/error-registration.component';
import { SuccessfulAccountCreationMessageComponent } from './successful-account-creation-message/successful-account-creation-message.component';

@Component({ template: '' })
class DummyComponent {}

describe('RegistrationPageComponent', () => {
    let component: RegistrationPageComponent;
    let fixture: ComponentFixture<RegistrationPageComponent>;
    let projectSettingsService: ProjectSettingsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatDialogModule,
                HttpClientTestingModule,
                MatSnackBarModule,
                BrowserAnimationsModule,
                RegistrationPageComponent,
            ],
            providers: [
                provideRouter([
                    { path: 'registration', component: RegistrationPageComponent },
                    { path: 'login', component: DummyComponent },
                ]),
                { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
                { provide: DateAdapter },
                ProjectSettingsService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RegistrationPageComponent);
        component = fixture.componentInstance;
        projectSettingsService = TestBed.inject(ProjectSettingsService);
        spyOn(projectSettingsService, 'setProjectSettings');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the registration form with default values', () => {
        expect(component.registrationForm).toBeTruthy();
        const emailControl = component.registrationForm.get('email');

        expect(emailControl).toBeTruthy();

        if (emailControl) {
            expect(emailControl.validator).toBeTruthy();
        }
    });

    it('should have invalid form when empty', () => {
        expect(component.registrationForm.valid).toBeFalsy();
    });

    it('should set default billing address when useDefaultShippingAddress is checked', () => {
        const useDefaultShippingAddress = fixture.debugElement.query(
            By.css('#use-default-shipping-address'),
        );

        useDefaultShippingAddress.triggerEventHandler('change', { checked: true });
        fixture.detectChanges();
        const billingAddressCountry =
            component.registrationForm.controls.addresses.controls[1].controls.country.value;
        const shippingAddressCountry =
            component.registrationForm.controls.addresses.controls[0].controls.country.value;

        expect(billingAddressCountry).toEqual(shippingAddressCountry);
    });

    it('should clear billing address when useAddressForBilling is unchecked', () => {
        const useAddressForBilling = fixture.debugElement.query(By.css('#use-address-for-billing'));

        useAddressForBilling.triggerEventHandler('change', { checked: false });
        fixture.detectChanges();
        const billingAddressControls =
            component.registrationForm.controls.addresses.controls[1].controls;

        expect(billingAddressControls.country.value).toBe('');
        expect(billingAddressControls.city.value).toBe('');
        expect(billingAddressControls.streetName.value).toBe('');
        expect(billingAddressControls.postalCode.value).toBe('');
    });

    it('should keep billing address when useAddressForBilling is checked', () => {
        const useAddressForBilling = fixture.debugElement.query(By.css('#use-address-for-billing'));

        useAddressForBilling.triggerEventHandler('change', { checked: true });
        fixture.detectChanges();
        const billingAddressControls =
            component.registrationForm.controls.addresses.controls[1].controls;

        expect(billingAddressControls.country.value).toBe(
            component.registrationForm.controls.addresses.controls[0].controls.country.value,
        );
    });

    it('should open snack bar with error message on error', () => {
        spyOn(component['snackBar'], 'openFromComponent');
        component.openSnackBar(true);
        expect(component['snackBar'].openFromComponent).toHaveBeenCalledWith(
            ErrorRegistrationComponent,
            { duration: 3000 },
        );
    });

    it('should open snack bar with success message on success', () => {
        spyOn(component['snackBar'], 'openFromComponent');
        component.openSnackBar(false);
        expect(component['snackBar'].openFromComponent).toHaveBeenCalledWith(
            SuccessfulAccountCreationMessageComponent,
            { duration: 3000 },
        );
    });

    it('should call signUpCustomer with default addresses', () => {
        spyOn(component['authService'], 'signUpCustomer').and.returnValue(
            of({ customer: {} } as CustomerResponseDto),
        );
        spyOn(component['authService'], 'getPasswordFlowToken').and.returnValue(
            of({} as AccessTokenResponseDto),
        );
        spyOn(component['router'], 'navigateByUrl');
        const emailControl = component.registrationForm.get('email');

        emailControl?.setValue('test@example.com');
        const passwordControl = component.registrationForm.get('password');

        passwordControl?.setValue('ValidPassword1!');
        const firstNameControl = component.registrationForm.get('firstName');

        firstNameControl?.setValue('John');
        const lastNameControl = component.registrationForm.get('lastName');

        lastNameControl?.setValue('Doe');
        const dateOfBirthControl = component.registrationForm.get('dateOfBirth');

        dateOfBirthControl?.setValue('2000-01-01');
        fixture.detectChanges();
        component.signUpCustomer(true, true);
        expect(component['authService'].signUpCustomer).toHaveBeenCalled();
        expect(component['router'].navigateByUrl).toHaveBeenCalledWith('/main');
    });

    it('should call signUpCustomer with non-default addresses', () => {
        spyOn(component['authService'], 'signUpCustomer').and.returnValue(
            of({ customer: {} } as CustomerResponseDto),
        );
        spyOn(component['authService'], 'getPasswordFlowToken').and.returnValue(
            of({} as AccessTokenResponseDto),
        );
        spyOn(component['router'], 'navigateByUrl');
        const emailControl = component.registrationForm.get('email');

        emailControl?.setValue('test@example.com');
        const passwordControl = component.registrationForm.get('password');

        passwordControl?.setValue('ValidPassword1!');
        const firstNameControl = component.registrationForm.get('firstName');

        firstNameControl?.setValue('John');
        const lastNameControl = component.registrationForm.get('lastName');

        lastNameControl?.setValue('Doe');
        const dateOfBirthControl = component.registrationForm.get('dateOfBirth');

        dateOfBirthControl?.setValue('2000-01-01');
        fixture.detectChanges();
        component.signUpCustomer(false, false);
        expect(component['authService'].signUpCustomer).toHaveBeenCalled();
        expect(component['router'].navigateByUrl).toHaveBeenCalledWith('/main');
    });

    it('should set default billing address correctly', () => {
        const shippingAddressCountryControl =
            component.registrationForm.controls.addresses.controls[0].controls.country;
        const shippingAddressCityControl =
            component.registrationForm.controls.addresses.controls[0].controls.city;
        const shippingAddressStreetControl =
            component.registrationForm.controls.addresses.controls[0].controls.streetName;
        const shippingAddressPostalCodeControl =
            component.registrationForm.controls.addresses.controls[0].controls.postalCode;

        shippingAddressCountryControl.setValue('US');
        shippingAddressCityControl.setValue('New York');
        shippingAddressStreetControl.setValue('5th Avenue');
        shippingAddressPostalCodeControl.setValue('10001');

        component.setDefaultBillingAddress();

        const billingAddressControls =
            component.registrationForm.controls.addresses.controls[1].controls;

        expect(billingAddressControls.country.value).toBe('US');
        expect(billingAddressControls.city.value).toBe('New York');
        expect(billingAddressControls.streetName.value).toBe('5th Avenue');
        expect(billingAddressControls.postalCode.value).toBe('10001');
    });
});
