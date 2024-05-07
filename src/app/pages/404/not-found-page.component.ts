import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
    back() {
        window.history.back();
    }
}
