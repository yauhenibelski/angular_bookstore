import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearCartMessageComponent } from './clear-cart-message.component';

describe('ClearCartMessageComponent', () => {
    let component: ClearCartMessageComponent;
    let fixture: ComponentFixture<ClearCartMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClearCartMessageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ClearCartMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
