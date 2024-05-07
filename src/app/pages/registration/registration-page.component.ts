import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { isEmail } from './validators/email';
import { passwordValidators } from './validators/password';
import { GetErrorMassagePipe } from './pipes/get-error-massage.pipe';
import { hasOneCharacter } from './validators/has-one-character';
import { hasSpace } from './validators/has-space';
import { isDate } from './validators/date';

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
        MatCheckboxModule,
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
    private readonly formBuilder = inject(FormBuilder);

    readonly registrationForm = this.formBuilder.group({
        email: ['', [isEmail]],
        shippingAddress: ['', [isEmail]],
        password: ['', [...Object.values(passwordValidators)]],
        firstName: ['', [hasOneCharacter, hasSpace]],
        lastName: ['', [hasOneCharacter, hasSpace]],
        country: ['', [hasOneCharacter, hasSpace]],
        city: ['', [hasOneCharacter, hasSpace]],
        street: ['', [hasOneCharacter, hasSpace]],
        postalCode: ['', [hasOneCharacter, hasSpace]],
        date: ['', [isDate]],
    });

    readonly controls = this.registrationForm.controls;

    isPasswordHide = true;
}
