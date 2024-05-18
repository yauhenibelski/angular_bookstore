import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

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
    private readonly apiService = inject(ApiService);
    readonly isLogined$ = this.authService.isLogined$;

    logOut(): void {
        if (!this.authService.isLogined) {
            return;
        }

        this.authService.getAccessAnonymousToken().subscribe(() => {
            this.apiService.createAnonymousCart();
        });
    }
}
