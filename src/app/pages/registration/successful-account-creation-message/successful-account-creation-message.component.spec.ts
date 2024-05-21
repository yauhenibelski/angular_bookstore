import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulAccountCreationMessageComponent } from './successful-account-creation-message.component';

describe('SuccessfulAccountCreationMessageComponent', () => {
    let component: SuccessfulAccountCreationMessageComponent;
    let fixture: ComponentFixture<SuccessfulAccountCreationMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SuccessfulAccountCreationMessageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SuccessfulAccountCreationMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
