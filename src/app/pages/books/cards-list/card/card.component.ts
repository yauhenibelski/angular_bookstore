import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { Product } from 'src/app/interfaces/product';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, CurrencyPipe, MatIconModule, RouterLink],
})
export class CardComponent {
    @Input({ required: true }) book!: Product;
}
