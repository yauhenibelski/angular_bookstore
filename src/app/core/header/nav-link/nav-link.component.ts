import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { map, filter } from 'rxjs';

@Component({
    selector: 'app-nav-link',
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './nav-link.component.html',
    styleUrl: './nav-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLinkComponent {
    readonly links$ = this.router.events.pipe(
        map(event => {
            if (event instanceof NavigationEnd) {
                return event.urlAfterRedirects.split('/').filter(Boolean);
            }

            return null;
        }),
        filter(Boolean),
    );

    constructor(public router: Router) {}

    navigate(fragment: string): void {
        const url = this.router.routerState.snapshot.url.split('/');
        const fragmentIndex = url.indexOf(fragment);
        const newPath = url.slice(0, fragmentIndex + 1);

        this.router.navigate(newPath);
    }
}
