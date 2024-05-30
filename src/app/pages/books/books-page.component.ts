import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';

@Component({
    selector: 'app-books-page',
    standalone: true,
    templateUrl: './books-page.component.html',
    styleUrl: './books-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, CategoryComponent, SearchComponent],
})
export class BooksPageComponent {}
