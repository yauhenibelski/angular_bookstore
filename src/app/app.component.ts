import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationPageComponent } from './pages/registration/registration-page.component';
import { HeaderComponent } from './core/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, RegistrationPageComponent, HeaderComponent],
})
export class AppComponent {
    title = 'final-task';
}
