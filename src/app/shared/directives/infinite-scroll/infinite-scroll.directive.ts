import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appInfiniteScroll]',
    standalone: true,
})
export class InfiniteScrollDirective {
    @Input() min_padding = 500;
    @Output() loadProducts = new EventEmitter();
    @HostListener('scroll', ['$event.target']) scroll({
        scrollHeight,
        scrollTop,
        offsetHeight,
    }: HTMLElement) {
        const scrollDown = scrollHeight - scrollTop - offsetHeight;

        if (scrollDown <= this.min_padding) {
            this.loadProducts.emit();
        }
    }
}
