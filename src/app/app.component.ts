import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { LoaderService } from './shared/services/loader/loader.service';
import { ProfilePageComponent } from './pages/profile/profile-page.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        AsyncPipe,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        MatProgressBarModule,
        ProfilePageComponent,
    ],
})
export class AppComponent {
    readonly isLoading$ = inject(LoaderService).isLoading$;
}
