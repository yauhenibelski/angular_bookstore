import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainComponent, HttpClientTestingModule],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
