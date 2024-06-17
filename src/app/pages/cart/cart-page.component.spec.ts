import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart/cart.service';
import { CartPageComponent } from './cart-page.component';

describe('CartPageComponent', () => {
    let component: CartPageComponent;
    let fixture: ComponentFixture<CartPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, CartPageComponent],
            providers: [
                CartService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: '123' }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CartPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
