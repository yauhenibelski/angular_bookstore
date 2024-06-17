import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ClearCartMessageComponent } from './clear-cart-message.component';
import { CartService } from '../../../shared/services/cart/cart.service';

describe('ClearCartMessageComponent', () => {
    let component: ClearCartMessageComponent;
    let fixture: ComponentFixture<ClearCartMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, ClearCartMessageComponent],
            providers: [CartService],
        }).compileComponents();

        fixture = TestBed.createComponent(ClearCartMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
