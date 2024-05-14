import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-error-message',
    standalone: true,
    imports: [],
    templateUrl: './error-message.component.html',
    styleUrl: './error-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {}
