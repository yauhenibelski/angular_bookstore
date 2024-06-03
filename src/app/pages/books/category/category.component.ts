import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from './service/category.service';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [
        MatListModule,
        AsyncPipe,
        RouterLink,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
    ],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
    @ViewChild(MatMenu) readonly matMenu: MatMenu | null = null;

    private readonly categoryService = inject(CategoryService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly categoryList$ = this.categoryService.categoryList$;

    navigate(str: string, isParent: boolean): void {
        const childActivatedRoute = this.activatedRoute.firstChild;

        if (!childActivatedRoute) {
            return;
        }

        if (isParent) {
            this.router.navigate(['./', str], { relativeTo: this.activatedRoute });

            return;
        }

        if ('subcategory' in childActivatedRoute.snapshot.params) {
            this.router.navigate(['../', str], { relativeTo: childActivatedRoute });

            return;
        }

        this.router.navigate(['./', str], { relativeTo: childActivatedRoute });
    }
}
