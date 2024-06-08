import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private readonly categorySubject = new BehaviorSubject<Category[] | null>(null);

    readonly categoryList$ = this.categorySubject.asObservable();

    constructor(private readonly apiService: ApiService) {}

    loadCategory(): Observable<Category[]> {
        return this.apiService.getCategories().pipe(
            map(category => category.results),
            tap(categoryList => {
                this.categorySubject.next(categoryList);
            }),
        );
    }

    loadChildrenCategory(parentCategoryId: string): Observable<Category[]> {
        return this.apiService.getCategories(parentCategoryId).pipe(
            map(category => category.results),
            tap(categoryList => {
                this.categorySubject.next(categoryList);
            }),
        );
    }

    getCategoryByKey(key: string): Observable<Category> {
        return this.apiService.getCategoryByKey(key);
    }
}
