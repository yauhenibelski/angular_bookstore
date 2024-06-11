import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Input,
    OnInit,
    inject,
} from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CounterInputComponent } from 'src/app/shared/components/counter-input/counter-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CentsToEurosPipe } from '../../../shared/pipes/cents-to-euros/cents-to-euros.pipe';

@Component({
    selector: 'app-book',
    standalone: true,
    templateUrl: './book.component.html',
    styleUrl: './book.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CentsToEurosPipe,
        AsyncPipe,
        CurrencyPipe,
        MatCardModule,
        MatIconModule,
        CounterInputComponent,
        ReactiveFormsModule,
    ],
})
export class BookComponent implements OnInit {
    @Input({ required: true }) product: Product | null = null;

    private readonly destroyRef = inject(DestroyRef);
    readonly cartService = inject(CartService);

    readonly counter = new FormControl(0, { nonNullable: true });

    ngOnInit(): void {
        this.handleCounterValue();
    }

    handleCounterValue(): void {
        if (!this.product?.quantity) {
            return;
        }

        this.counter.setValue(this.product.quantity);

        this.counter.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(count => {
            this.cartService.updateCart('changeLineItemQuantity', this.product?.id, count);
        });
    }
}
