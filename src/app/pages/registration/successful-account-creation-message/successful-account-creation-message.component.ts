import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-successful-account-creation-message',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './successful-account-creation-message.component.html',
    styleUrl: './successful-account-creation-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessfulAccountCreationMessageComponent {}
