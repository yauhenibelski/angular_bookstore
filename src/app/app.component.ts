import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { LoaderService } from './shared/services/loader/loader.service';

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
        GalleryModule,
        LightboxModule,
    ],
})
export class AppComponent {
    readonly isLoading$ = inject(LoaderService).isLoading$;
}
