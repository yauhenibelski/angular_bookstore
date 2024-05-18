import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatAnchor, RouterLink, AsyncPipe, RouterLinkActive, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);
    readonly isLogined$ = this.authService.isLogined$;

    logOut(): void {
        if (!this.authService.isLogined) {
            return;
        }

        this.authService.getAccessAnonymousToken().pipe(untilDestroyed(this)).subscribe();
    }
}
