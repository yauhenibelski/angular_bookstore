import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardsListComponent } from './cards-list.component';

describe('CardsListComponent', () => {
    let component: CardsListComponent;
    let fixture: ComponentFixture<CardsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CardsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
