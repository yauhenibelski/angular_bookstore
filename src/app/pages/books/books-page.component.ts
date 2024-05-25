import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { products } from 'src/app/shared/products-mock';
import { CardsComponent } from './cards/cards.component';

@Component({
    selector: 'app-books-page',
    standalone: true,
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, JsonPipe, AsyncPipe, CardsComponent],
})
export class BooksPageComponent {
    readonly user = inject(CustomerService);
    readonly books = products;
}
