import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CheckUniqueEmail } from 'src/app/shared/form-validators/async-email-check';
import { isEmail } from '../../shared/form-validators/email';
import { GetErrorMassagePipe } from '../../shared/pipes/get-error-massage/get-error-massage.pipe';
import { passwordValidators } from '../../shared/form-validators/password';

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
    private readonly checkUniqueEmail = inject(CheckUniqueEmail);
    isPasswordHide = true;

    readonly loginForm = new FormGroup({
        email: new FormControl('', {
            validators: [isEmail],
            asyncValidators: [this.checkUniqueEmail.validate.bind(this.checkUniqueEmail)],
        }),
        password: new FormControl('', [...Object.values(passwordValidators)]),
    });

    readonly controls = this.loginForm.controls;
}
