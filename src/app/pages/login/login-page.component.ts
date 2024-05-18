import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CheckUniqueEmail } from 'src/app/shared/form-validators/async-email-check';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { switchMap, tap } from 'rxjs';
import { setAccessTokenInCookie } from 'src/app/shared/utils/set-access-token-in-cookie';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isEmail } from '../../shared/form-validators/email';
import { GetErrorMassagePipe } from '../../shared/pipes/get-error-massage/get-error-massage.pipe';
import { passwordValidators } from '../../shared/form-validators/password';

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        GetErrorMassagePipe,
        MatIconModule,
        RouterLink,
    ],
    providers: [CheckUniqueEmail],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
    private readonly apiService = inject(ApiService);
    private readonly authService = inject(AuthService);
    private readonly cartService = inject(CartService);
    private readonly customerService = inject(CustomerService);
    private readonly router = inject(Router);

    isPasswordHide = true;

    subscription = this.authService.isLogined$.subscribe(boolean => {
        if (boolean) {
            this.router.navigateByUrl('/main');
        }
    });

    readonly loginForm = new FormGroup({
        email: new FormControl('', {
            validators: [isEmail],
            nonNullable: true,
        }),
        password: new FormControl('', {
            validators: [...Object.values(passwordValidators)],
            nonNullable: true,
        }),
    });

    readonly controls = this.loginForm.controls;

    loginOrPasswordErrorOutput(): void {
        const formValue = this.loginForm.getRawValue();

        this.loginForm.controls.email.setValue(formValue.email);
        this.loginForm.controls.password.setValue('');

        this.loginForm.controls.email.setErrors({ error: 'wrong login or password' });
        this.loginForm.controls.password.setErrors({
            error: 'wrong login or password',
        });
    }

    signIn(): void {
        const formValue = this.loginForm.getRawValue();

        this.authService
            .signInCustomer(formValue)
            .pipe(
                tap(response => {
                    this.customerService.customer = response.customer;
                    this.cartService.setCart(response.cart);
                }),
                switchMap(() => {
                    return this.authService.getPasswordFlowToken(formValue);
                }),
            )
            .subscribe({
                next: passwordFlowToken => {
                    setAccessTokenInCookie(passwordFlowToken, false);

                    this.authService.setLoginStatus(true);
                },
                error: () => {
                    this.loginOrPasswordErrorOutput();
                },
            });
    }
}
