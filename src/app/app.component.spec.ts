import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LoaderService } from './shared/services/loader/loader.service';
import { AppComponent } from './app.component';

const routes = [{ path: '', component: AppComponent }];

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;
    let isLoadingSubject: BehaviorSubject<boolean>;
    let loaderServiceStub: Partial<LoaderService>;

    beforeEach(async () => {
        isLoadingSubject = new BehaviorSubject<boolean>(false);
        loaderServiceStub = {
            isLoading$: isLoadingSubject.asObservable(),
        };

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatProgressBarModule,
                NoopAnimationsModule,
                AppComponent,
            ],
            providers: [
                { provide: LoaderService, useValue: loaderServiceStub },
                provideRouter(routes),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should apply "mat-progress-bar-active" class when isLoading$ is true', async () => {
        isLoadingSubject.next(true);
        fixture.detectChanges();
        await fixture.whenStable();

        const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');

        expect(progressBar.classList.contains('mat-progress-bar-active')).toBeTrue();
    });

    it('should not apply "mat-progress-bar-active" class when isLoading$ is false', async () => {
        isLoadingSubject.next(false);
        fixture.detectChanges();
        await fixture.whenStable();

        const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');

        expect(progressBar.classList.contains('mat-progress-bar-active')).toBeFalse();
    });
});
