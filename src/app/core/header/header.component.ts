import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    login(): void {
        this.router.navigate(['login']);
    }

    registration() {
        this.router.navigate(['registration']);
    }

    constructor(private readonly router: Router) {
        this.router = router;
    }
}