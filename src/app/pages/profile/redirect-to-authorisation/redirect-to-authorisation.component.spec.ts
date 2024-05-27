import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToAuthorisationComponent } from './redirect-to-authorisation.component';

describe('RedirectToAuthorisationComponent', () => {
    let component: RedirectToAuthorisationComponent;
    let fixture: ComponentFixture<RedirectToAuthorisationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RedirectToAuthorisationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RedirectToAuthorisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
