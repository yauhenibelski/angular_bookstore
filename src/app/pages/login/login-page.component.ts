import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
    private readonly formBuilder = inject(FormBuilder);

    readonly loginForm = this.formBuilder.group({
        email: ['', []],
        password: ['', []],
    });

    readonly controls = this.loginForm.controls;
}
