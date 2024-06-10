import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CentsToEurosPipe } from '../../../shared/pipes/cents-to-euros/cents-to-euros.pipe';

@Component({
    selector: 'app-book',
    standalone: true,
    templateUrl: './book.component.html',
    styleUrl: './book.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CentsToEurosPipe, AsyncPipe, CurrencyPipe, MatCardModule, MatIconModule],
})
export class BookComponent {
    @Input({ required: true }) product!: Product;
    constructor(readonly cartService: CartService) {}
}
