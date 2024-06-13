import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements AfterViewInit {
    ngAfterViewInit() {
        const video = document.getElementById('video') as HTMLVideoElement;

        if (video) {
            video.muted = true;
            video.play().catch(error => {
                console.error('Video autoplay was prevented:', error);
            });
        }
    }
}
