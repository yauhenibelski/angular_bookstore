import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-books-page',
    standalone: true,
    imports: [],
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent {}
