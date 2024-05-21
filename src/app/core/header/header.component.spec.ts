import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
// import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class DummyComponent {}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    //   let location: Location;
    let authServiceMock: Partial<AuthService>;
    let isLoginedSubject: BehaviorSubject<boolean>;

    beforeEach(async () => {
        isLoginedSubject = new BehaviorSubject<boolean>(false);
        authServiceMock = {
            isLogined$: isLoginedSubject.asObservable(),
        };

        await TestBed.configureTestingModule({
            imports: [MatButtonModule, HttpClientTestingModule, HeaderComponent],
            providers: [
                provideRouter([
                    { path: 'login', component: DummyComponent },
                    { path: 'registration', component: DummyComponent },
                    { path: 'cart', component: DummyComponent },
                    { path: 'main', component: DummyComponent },
                ]),
                { provide: AuthService, useValue: authServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        //     location = TestBed.inject(Location);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display login button when not logged in', () => {
        const loginButton = fixture.debugElement.query(By.css('.buttons-wrap a:nth-child(2)'));

        expect(loginButton).toBeTruthy();
    });

    it('should display logout button when logged in', () => {
        isLoginedSubject.next(true);
        fixture.detectChanges();
        const logoutButton = fixture.debugElement.query(By.css('.buttons-wrap a:nth-child(2)'));

        expect(logoutButton).toBeTruthy();
    });

    it('should navigate to "/login" when login button is clicked', fakeAsync(() => {
        isLoginedSubject.next(false);
        fixture.detectChanges();
        const loginButton = fixture.debugElement.query(
            By.css('.buttons-wrap a:nth-child(2)'),
        ).nativeElement;

        loginButton.click();
        tick();
        expect(router.url).toBe('/login');
    }));

    it('should navigate to "/registration" when sign up button is clicked', fakeAsync(() => {
        const signUpButton = fixture.debugElement.query(
            By.css('.buttons-wrap a:last-child'),
        ).nativeElement;

        signUpButton.click();
        tick();
        expect(router.url).toBe('/registration');
    }));
});
