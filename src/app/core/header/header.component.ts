import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from 'src/app/shared/services/cart/cart.service';

@UntilDestroy()
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        MatAnchor,
        RouterLink,
        AsyncPipe,
        RouterLinkActive,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatProgressBarModule,
        MatBadgeModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);
    readonly cartService = inject(CartService);

    readonly isLoading$ = inject(LoaderService).isLoading$;
    readonly isLogined$ = this.authService.isLogined$;

    readonly cartLength = computed(() => {
        const length = this.cartService.cart()?.lineItems.length;

        this.matBadgeHidden = !length;

        return length;
    });

    matBadgeHidden = true;

    logOut(): void {
        if (this.authService.isLogined) {
            this.authService.getAccessAnonymousToken().pipe(untilDestroyed(this)).subscribe();
        }
    }
}
