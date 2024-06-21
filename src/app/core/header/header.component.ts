import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
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
    readonly isLoading$ = inject(LoaderService).isLoading$;
    readonly isLogined$ = this.authService.isLogined$;
    readonly quantityOfProducts = this.cartService.quantityOfProducts();

    matBadgeHidden = true;

    constructor(
        private readonly authService: AuthService,
        private readonly cartService: CartService,
    ) {
        effect(() => {
            this.matBadgeHidden = Boolean(!this.quantityOfProducts());
        });
    }

    logOut(): void {
        if (this.authService.isLogined) {
            this.authService.getAccessAnonymousToken().pipe(untilDestroyed(this)).subscribe();
        }
    }
}
