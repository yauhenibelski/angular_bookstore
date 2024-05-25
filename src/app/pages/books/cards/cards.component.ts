import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { ProductDto } from 'src/app/interfaces/product';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-cards',
    standalone: true,
    templateUrl: './cards.component.html',
    styleUrl: './cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, CurrencyPipe, MatIconModule],
})
export class CardsComponent {
    @Input({ required: true }) book!: ProductDto;
}
