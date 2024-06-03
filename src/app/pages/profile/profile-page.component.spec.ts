import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckUniqueEmail } from 'src/app/shared/validators/async-email-check';
import { Customer, Address } from 'src/app/interfaces/customer-response-dto';
import { ProfilePageComponent } from './profile-page.component';

interface CustomerServiceMock {
    customer$: Observable<Customer>;
    addresses: Observable<Address[]>;
    setCustomer: jasmine.Spy;
}

interface ApiServiceMock {
    updateCustomer: jasmine.Spy;
    changePassword: jasmine.Spy;
}

interface AuthServiceMock {
    getPasswordFlowToken: jasmine.Spy;
}

interface SnackBarMock {
    open: jasmine.Spy;
}

interface CheckUniqueEmailMock {
    validate: jasmine.Spy;
}

describe('ProfilePageComponent', () => {
    let component: ProfilePageComponent;
    let fixture: ComponentFixture<ProfilePageComponent>;
    let customerServiceMock: CustomerServiceMock;
    let apiServiceMock: ApiServiceMock;
    let authServiceMock: AuthServiceMock;
    let snackBarMock: SnackBarMock;
    let checkUniqueEmailMock: CheckUniqueEmailMock;

    beforeEach(async () => {
        customerServiceMock = {
            customer$: of({
                addresses: [],
                email: '',
                firstName: '',
                id: '',
                isEmailVerified: false,
                dateOfBirth: '',
                lastName: '',
                password: '',
                version: 0,
                createdAt: '',
                lastModifiedAt: '',
                authenticationMode: '',
                stores: [],
                billingAddressIds: [],
                shippingAddressIds: [],
            }),
            addresses: of([]),
            setCustomer: jasmine.createSpy('setCustomer'),
        };

        apiServiceMock = jasmine.createSpyObj<ApiServiceMock>('ApiService', [
            'updateCustomer',
            'changePassword',
        ]);
        authServiceMock = jasmine.createSpyObj<AuthServiceMock>('AuthService', [
            'getPasswordFlowToken',
        ]);
        snackBarMock = jasmine.createSpyObj<SnackBarMock>('MatSnackBar', ['open']);
        checkUniqueEmailMock = {
            validate: jasmine.createSpy('validate').and.returnValue(of(null)),
        };

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatSnackBarModule,
                MatFormFieldModule,
                NoopAnimationsModule,
                ProfilePageComponent,
            ],
            providers: [
                { provide: CustomerService, useValue: customerServiceMock },
                { provide: ApiService, useValue: apiServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: CheckUniqueEmail, useValue: checkUniqueEmailMock },
                FormBuilder,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfilePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be initialized', () => {
        expect(customerServiceMock).toBeDefined();
        expect(apiServiceMock).toBeDefined();
        expect(authServiceMock).toBeDefined();
        expect(snackBarMock).toBeDefined();
        expect(checkUniqueEmailMock).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty fields', () => {
        expect(component.form.get('firstName')?.value).toEqual('');
        expect(component.form.get('lastName')?.value).toEqual('');
        expect(component.form.get('dateOfBirth')?.value).toEqual('');
        expect(component.form.get('email')?.value).toEqual('');
    });

    it('should call updateCustomer on form submit and handle success', () => {
        spyOn(component, 'resetControls');

        apiServiceMock.updateCustomer.and.returnValue(of({}));

        component.updateCustomer('setFirstName');

        expect(apiServiceMock.updateCustomer).toHaveBeenCalled();
        expect(snackBarMock.open).toHaveBeenCalled();
        expect(component.resetControls).toHaveBeenCalled();
    });

    it('should handle API error on updateCustomer', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Error occurred' },
            status: 400,
        });

        apiServiceMock.updateCustomer.and.returnValue(throwError(() => errorResponse));
        component.updateCustomer('setFirstName');
        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Error occurred',
            undefined,
            jasmine.any(Object),
        );
    });

    it('should handle API error when updating address', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Failed to update address' },
            status: 400,
        });

        apiServiceMock.updateCustomer.and.returnValue(throwError(() => errorResponse));
        component.updateAddress(
            { streetName: 'Main St', postalCode: '12345', city: 'Anytown', country: 'USA' },
            '1',
            'billing',
            true,
        );
        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Failed to update address',
            undefined,
            jasmine.any(Object),
        );
    });

    it('should change password and call API correctly', () => {
        component.form.get('currentPassword')?.setValue('oldpassword');
        component.form.get('newPassword')?.setValue('newpassword');
        apiServiceMock.changePassword.and.returnValue(of({ email: 'test@example.com' }));
        authServiceMock.getPasswordFlowToken.and.returnValue(of({}));

        component.changePassword();

        expect(apiServiceMock.changePassword).toHaveBeenCalledWith('oldpassword', 'newpassword');
        expect(authServiceMock.getPasswordFlowToken).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'newpassword',
        });
        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Successfully changed',
            undefined,
            jasmine.any(Object),
        );
    });

    it('should add a new address and handle success', () => {
        const address: Address = {
            streetName: 'Main St',
            postalCode: '12345',
            city: 'Anytown',
            country: 'USA',
        };
        const addresses: Address[] = [
            { id: '1', streetName: '', postalCode: '', city: '', country: '' },
            { id: '2', streetName: '', postalCode: '', city: '', country: '' },
        ];

        apiServiceMock.updateCustomer.and.returnValues(of({ addresses }), of({}));

        component.addAddress(address, 'shipping', true);

        expect(apiServiceMock.updateCustomer.calls.argsFor(0)[0]).toEqual('addAddress');
        expect(apiServiceMock.updateCustomer.calls.argsFor(1)[0]).toEqual('addShippingAddressId');
        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Successfully changed',
            undefined,
            jasmine.any(Object),
        );
    });

    it('should remove an address and handle API calls', () => {
        apiServiceMock.updateCustomer.and.returnValue(of({}));
        component.removeAddress('1');
        expect(apiServiceMock.updateCustomer).toHaveBeenCalledWith('removeAddress', {
            addressId: '1',
        });
        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Successfully changed',
            undefined,
            jasmine.any(Object),
        );
    });
});
