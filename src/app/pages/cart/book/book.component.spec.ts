import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BookComponent } from './book.component';
import { CartService } from '../../../shared/services/cart/cart.service';

describe('BookComponent', () => {
    let component: BookComponent;
    let fixture: ComponentFixture<BookComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, BookComponent],
            providers: [CartService],
        }).compileComponents();

        fixture = TestBed.createComponent(BookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
