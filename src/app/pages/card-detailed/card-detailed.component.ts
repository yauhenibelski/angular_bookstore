// import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// import { products } from 'src/app/shared/products-mock';
// import { ProductDto } from 'src/app/interfaces/product';
// import { CurrencyPipe } from '@angular/common';

// @Component({
//     selector: 'app-card-detailed',
//     standalone: true,
//     imports: [CurrencyPipe],
//     templateUrl: './card-detailed.component.html',
//     styleUrl: './card-detailed.component.scss',
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class CardDetailedComponent {
//     @Input() id!: string;
//     idBooks: ProductDto[] = products;
//     item!: ProductDto | undefined;
//     ngOnInit() {
//         this.item = this.idBooks.find(data => data.id === this.id);
//         console.info('id:', this.id);
//         console.info(this.item);
//     }
// }
console.info('--');
