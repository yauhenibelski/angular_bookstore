import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-error-registration',
    standalone: true,
    imports: [],
    templateUrl: './error-registration.component.html',
    styleUrl: './error-registration.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorRegistrationComponent {}
