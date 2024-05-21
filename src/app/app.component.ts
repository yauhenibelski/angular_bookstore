import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RegistrationPageComponent } from './pages/registration/registration-page.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { LoaderService } from './shared/services/loader/loader.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        CommonModule,
        RouterOutlet,
        RegistrationPageComponent,
        HeaderComponent,
        FooterComponent,
        MatProgressBarModule,
    ],
})
export class AppComponent {
    readonly isLoading$ = inject(LoaderService).isLoading$;
}
