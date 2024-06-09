import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { AsyncPipe } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SortProductService } from 'src/app/shared/services/sort-product/sort-product.service';
import { InfiniteScrollDirective } from 'src/app/shared/directives/infinite-scroll/infinite-scroll.directive';
import { CategoryService } from '../category/service/category.service';
import { CardComponent } from './card/card.component';

@UntilDestroy()
@Component({
    selector: 'app-cards-list',
    standalone: true,
    templateUrl: './cards-list.component.html',
    styleUrl: './cards-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent, AsyncPipe],
    hostDirectives: [InfiniteScrollDirective],
})
export class CardsListComponent implements OnDestroy {
    private readonly productStoreService = inject(ProductStoreService);
    private readonly sortProductService = inject(SortProductService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly categoryService = inject(CategoryService);
    private readonly router = inject(Router);

    constructor(private readonly infiniteScrollDirective: InfiniteScrollDirective) {
        infiniteScrollDirective.loadProducts.pipe(untilDestroyed(this)).subscribe(() => {
            this.productStoreService.loadAdditionalProducts();
        });
    }

    readonly books$ = this.activatedRoute.paramMap.pipe(
        untilDestroyed(this),
        switchMap(params => {
            const category = params.get('category')?.toLowerCase();
            const subcategory = params.get('subcategory')?.toLowerCase();

            if (subcategory && category) {
                return this.categoryService.getCategoryByKey(category).pipe(
                    untilDestroyed(this),
                    switchMap(({ id }) => this.categoryService.loadChildrenCategory(id)),
                    switchMap(() =>
                        this.categoryService.getCategoryByKey(subcategory).pipe(
                            tap({
                                next: ({ id }) => {
                                    this.sortProductService.categoryID = id;
                                    this.productStoreService.loadProducts();
                                },
                                error: () => {
                                    this.router.navigateByUrl('/404');
                                },
                            }),
                        ),
                    ),
                    switchMap(() => this.productStoreService.products$),
                );
            }

            if (category) {
                return this.categoryService.getCategoryByKey(category).pipe(
                    untilDestroyed(this),
                    tap(({ id }) => {
                        this.sortProductService.categoryID = id;
                        this.productStoreService.loadProducts();
                    }),
                    switchMap(({ id }) =>
                        this.categoryService.loadChildrenCategory(id).pipe(
                            tap({
                                error: () => {
                                    this.router.navigateByUrl('/404');
                                },
                            }),
                        ),
                    ),
                    switchMap(() => this.productStoreService.products$),
                );
            }

            this.sortProductService.categoryID = null;
            this.productStoreService.loadProducts();

            this.categoryService.loadCategory().pipe(untilDestroyed(this)).subscribe();

            return this.productStoreService.products$;
        }),
    );

    ngOnDestroy(): void {
        this.sortProductService.categoryID = null;
    }
}
