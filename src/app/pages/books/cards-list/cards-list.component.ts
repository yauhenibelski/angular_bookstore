import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll, defer, from, fromEvent, iif, map, switchMap, tap } from 'rxjs';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { AsyncPipe } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SortProductService } from 'src/app/shared/services/sort-product/sort-product.service';
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
})
export class CardsListComponent implements OnDestroy {
    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly categoryService: CategoryService,
        private readonly sortProductService: SortProductService,
        private readonly productStoreService: ProductStoreService,
        elementRef: ElementRef,
    ) {
        fromEvent<Event>(elementRef.nativeElement, 'scroll')
            .pipe(
                untilDestroyed(this),
                map(({ target }) => <HTMLElement>target),
            )
            .subscribe(host => {
                const { scrollHeight, scrollTop, offsetHeight } = host;
                const MIN_PADDING = 500;

                const scrollDown = scrollHeight - scrollTop - offsetHeight;

                if (scrollDown <= MIN_PADDING) {
                    productStoreService.loadAdditionalProducts();
                }
            });
    }

    readonly books$ = this.activatedRoute.paramMap
        .pipe(
            untilDestroyed(this),
            switchMap(params => {
                const category = params.get('category')?.toLowerCase();
                const subcategory = params.get('subcategory')?.toLowerCase();

                return iif(
                    () => Boolean(category),
                    defer(() => {
                        if (subcategory) {
                            return this.categoryService.getCategoryByKey(category!).pipe(
                                switchMap(({ id }) =>
                                    from([
                                        this.categoryService.loadChildrenCategory(id),
                                        this.categoryService.getCategoryByKey(subcategory).pipe(
                                            tap({
                                                next: ({ id }) => {
                                                    this.sortProductService.categoryID = id;
                                                },
                                                error: () => {
                                                    this.router.navigateByUrl('/404');
                                                },
                                            }),
                                        ),
                                    ]),
                                ),
                                concatAll(),
                            );
                        }

                        return this.categoryService.getCategoryByKey(category!).pipe(
                            switchMap(({ id }) => {
                                this.sortProductService.categoryID = id;

                                return this.categoryService.loadChildrenCategory(id).pipe(
                                    tap({
                                        error: () => {
                                            this.router.navigateByUrl('/404');
                                        },
                                    }),
                                );
                            }),
                        );
                    }),
                    defer(() => {
                        this.sortProductService.categoryID = null;

                        return this.categoryService.loadCategory();
                    }),
                );
            }),
        )
        .pipe(
            switchMap(() => {
                this.productStoreService.loadProducts();

                return this.productStoreService.products$;
            }),
        );

    ngOnDestroy(): void {
        this.sortProductService.categoryID = null;
    }
}
