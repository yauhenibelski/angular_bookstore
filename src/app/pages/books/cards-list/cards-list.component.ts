import { ChangeDetectionStrategy, Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, concatAll, concatMap, defer, from, iif, switchMap, tap } from 'rxjs';
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
    @HostListener('scroll', ['$event.target']) scroll({
        scrollHeight,
        scrollTop,
        offsetHeight,
    }: HTMLElement) {
        const scrollDown = scrollHeight - scrollTop - offsetHeight;
        const MIN_PADDING_PX = 500;

        if (scrollDown <= MIN_PADDING_PX) {
            this.productStoreService.loadAdditionalProducts();
        }
    }

    readonly books$ = this.productStoreService.products$;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly categoryService: CategoryService,
        private readonly sortProductService: SortProductService,
        private readonly productStoreService: ProductStoreService,
    ) {
        this.handleActivatedRoute().subscribe();
    }

    private handleActivatedRoute(): Observable<unknown> {
        return this.activatedRoute.paramMap.pipe(
            untilDestroyed(this),
            concatMap(params => {
                const category = params.get('category')?.toLowerCase();
                const subcategory = params.get('subcategory')?.toLowerCase();

                return iif(
                    () => Boolean(category),
                    defer(() =>
                        subcategory
                            ? this.categoryService.getCategoryByKey(category!).pipe(
                                  switchMap(({ id }) =>
                                      from([
                                          this.categoryService.loadChildrenCategory(id),
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
                                      ]),
                                  ),
                                  concatAll(),
                              )
                            : this.categoryService.getCategoryByKey(category!).pipe(
                                  switchMap(({ id }) => {
                                      this.sortProductService.categoryID = id;
                                      this.productStoreService.loadProducts();

                                      return this.categoryService.loadChildrenCategory(id).pipe(
                                          tap({
                                              error: () => {
                                                  this.router.navigateByUrl('/404');
                                              },
                                          }),
                                      );
                                  }),
                              ),
                    ),
                    defer(() => {
                        this.sortProductService.categoryID = null;
                        this.productStoreService.loadProducts();

                        return this.categoryService.loadCategory();
                    }),
                );
            }),
        );
    }

    ngOnDestroy(): void {
        this.sortProductService.categoryID = null;
    }
}
