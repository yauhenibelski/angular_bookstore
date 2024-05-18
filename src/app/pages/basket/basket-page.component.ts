import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-basket-page',
    standalone: true,
    imports: [],
    templateUrl: './basket-page.component.html',
    styleUrl: './basket-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageComponent {}
