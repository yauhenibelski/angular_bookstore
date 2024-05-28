import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-redirect-to-authorization',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './redirect-to-authorization.component.html',
    styleUrl: './redirect-to-authorization.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectToAuthorizationComponent {}
