import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-books-page',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent {}
