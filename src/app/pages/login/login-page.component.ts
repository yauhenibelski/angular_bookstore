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
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { setAccessTokenInCookie } from 'src/app/shared/utils/set-access-token-in-cookie';
import { isEmail } from '../../shared/form-validators/email';
import { GetErrorMassagePipe } from '../../shared/pipes/get-error-massage/get-error-massage.pipe';
import { passwordValidators } from '../../shared/form-validators/password';
import { ErrorMessageComponent } from './error-message/error-message.component';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatBottomSheetModule,
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
    private readonly cartService = inject(CartService);
    private readonly customerService = inject(CustomerService);
    private readonly bottomSheet = inject(MatBottomSheet);
    private readonly router = inject(Router);

    isPasswordHide = true;

    openBottomSheet(): void {
        this.bottomSheet.open(ErrorMessageComponent);
    }

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

    signIn(): void {
        const formValue = this.loginForm.getRawValue();

        this.apiService
            .signInCustomer(formValue)
            .pipe(
                tap(response => {
                    this.customerService.customer = response.customer;
                    this.cartService.card = response.cart;
                }),
                switchMap(() => {
                    return this.apiService.getPasswordFlowToken(formValue);
                }),
            )
            .subscribe({
                next: passwordFlowToken => {
                    this.router.navigateByUrl('/main');
                    setAccessTokenInCookie(passwordFlowToken, false);
                },
                error: () => {
                    this.openBottomSheet();
                },
            });
    }
}
