import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';

@Component({
    selector: 'app-books-page',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, JsonPipe, AsyncPipe],
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent {
    readonly user = inject(CustomerService);
}
