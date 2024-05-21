import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginPageComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [ApiService, AuthService, { provide: MatBottomSheet, useValue: {} }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(LoginPageComponent);
        const component = fixture.componentInstance;

        expect(component).toBeTruthy();
    });
});
