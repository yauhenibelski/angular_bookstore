import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { BooksPageComponent } from './books-page.component';

@Component({ template: '' })
class DummyComponent {}

describe('BooksPageComponent', () => {
    let component: BooksPageComponent;
    let fixture: ComponentFixture<BooksPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, NoopAnimationsModule, BooksPageComponent],
            providers: [
                provideRouter([
                    { path: 'books', component: BooksPageComponent },
                    { path: 'dummy', component: DummyComponent },
                ]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BooksPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
