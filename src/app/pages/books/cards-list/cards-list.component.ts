/* eslint-disable rxjs/no-nested-subscribe */
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ProductStoreService } from 'src/app/shared/services/product-store/product-store.service';
import { AsyncPipe } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
export class CardsListComponent implements OnInit {
    private readonly productStoreService = inject(ProductStoreService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly categoryService = inject(CategoryService);
    private readonly router = inject(Router);

    readonly books$ = this.productStoreService.products$;

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            const category = params.get('category')?.toLowerCase();
            const subcategory = params.get('subcategory')?.toLowerCase();

            if (subcategory && category) {
                this.categoryService
                    .getCategoryByKey(category)
                    .pipe(
                        untilDestroyed(this),
                        switchMap(({ id }) => this.categoryService.loadChildrenCategory(id)),
                        switchMap(() => this.categoryService.getCategoryByKey(subcategory)),
                    )
                    .subscribe({
                        next: ({ id }) => {
                            this.productStoreService.loadProductsByCategory(id);
                        },
                        error: () => {
                            this.router.navigateByUrl('/404');
                        },
                    });

                return;
            }

            if (category) {
                this.categoryService
                    .getCategoryByKey(category)
                    .pipe(
                        untilDestroyed(this),
                        tap(({ id }) => {
                            this.productStoreService.loadProductsByCategory(id);
                        }),
                        switchMap(({ id }) => this.categoryService.loadChildrenCategory(id)),
                    )
                    .subscribe({
                        error: () => {
                            this.router.navigateByUrl('/404');
                        },
                    });

                return;
            }

            this.categoryService
                .loadCategory()
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                    this.productStoreService.loadProducts();
                });
        });
    }
}
