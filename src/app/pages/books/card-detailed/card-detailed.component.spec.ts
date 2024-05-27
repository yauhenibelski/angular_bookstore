import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailedComponent } from './card-detailed.component';

describe('CardDetailedComponent', () => {
    let component: CardDetailedComponent;
    let fixture: ComponentFixture<CardDetailedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardDetailedComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardDetailedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
