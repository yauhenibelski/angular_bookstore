import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterLink } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        FormsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        RouterLink,
        MatIconModule,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    private readonly apiService = inject(ApiService);

    readonly control = new FormControl('', { nonNullable: true });

    books$: Observable<Product[]> = this.control.valueChanges.pipe(
        debounceTime(500),
        filter(value => value.length > 2),
        distinctUntilChanged(),
        switchMap(value =>
            this.apiService.searchProduct(value).pipe(map(({ results }) => results)),
        ),
    );
}
