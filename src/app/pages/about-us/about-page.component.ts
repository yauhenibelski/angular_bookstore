import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-about-page',
    standalone: true,
    imports: [MatTabsModule],
    templateUrl: './about-page.component.html',
    styleUrl: './about-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {}
