import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild,
    inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
    @ViewChild('video', { static: true }) video!: ElementRef;

    private readonly renderer = inject(Renderer2);

    ngOnInit(): void {
        const { nativeElement: video } = this.video;

        this.renderer.setProperty(video, 'muted', true);

        (<HTMLVideoElement>video).play();
    }
}
