import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-redirect-to-authorisation',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './redirect-to-authorisation.component.html',
    styleUrl: './redirect-to-authorisation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectToAuthorisationComponent {}
