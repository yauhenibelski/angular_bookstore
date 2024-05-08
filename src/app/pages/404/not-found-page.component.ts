import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [MatButton],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
    returnWindowHistoryBack() {
        window.history.back();
    }
}
