import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart/cart.service';

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

    discountCodes = this.cartService.discountCodes;

    constructor(
        private readonly cartService: CartService,
        private readonly renderer: Renderer2,
    ) {
        cartService.loadDiscountCodes();
    }

    ngOnInit(): void {
        const { nativeElement: video } = this.video;

        this.renderer.setProperty(video, 'muted', true);
        this.renderer.setProperty(video, 'autoplay', true);
    }
}
