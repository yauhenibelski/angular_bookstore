import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RedirectToAuthorizationComponent } from './redirect-to-authorization.component';

describe('RedirectToAuthorizationComponent', () => {
    let component: RedirectToAuthorizationComponent;
    let fixture: ComponentFixture<RedirectToAuthorizationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RedirectToAuthorizationComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(RedirectToAuthorizationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
