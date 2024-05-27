import { ChangeDetectionStrategy, Component } from '@angular/core';
import { products } from 'src/app/shared/products-mock';
import { CardComponent } from './card/card.component';

@Component({
    selector: 'app-cards-list',
    standalone: true,
    templateUrl: './cards-list.component.html',
    styleUrl: './cards-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent],
})
export class CardsListComponent {
    readonly books = products;
}
