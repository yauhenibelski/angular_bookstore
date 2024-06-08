import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardDetailedComponent } from './card-detailed.component';
import { ApiService } from '../../shared/services/api/api.service';

describe('CardDetailedComponent', () => {
    let component: CardDetailedComponent;
    let fixture: ComponentFixture<CardDetailedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, CardDetailedComponent],
            providers: [ApiService],
        }).compileComponents();

        fixture = TestBed.createComponent(CardDetailedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
