import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CategoryComponent } from './category.component';
import { CategoryService } from './service/category.service';
import { ApiService } from '../../../shared/services/api/api.service';

describe('CategoryComponent', () => {
    let component: CategoryComponent;
    let fixture: ComponentFixture<CategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, CategoryComponent],
            providers: [
                CategoryService,
                ApiService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
