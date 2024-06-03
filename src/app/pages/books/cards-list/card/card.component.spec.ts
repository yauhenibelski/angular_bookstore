import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ key: 'testKey' }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;

        const mockProduct: Product = {
            name: { en: 'Test Book' },
            description: { en: 'Test Description' },
            categories: [{ typeId: 'category', id: 'cat1' }],
            slug: { en: 'test-book' },
            categoryOrderHints: {},
            variants: [],
            searchKeywords: {},
            masterVariant: {
                id: 1,
                key: 'master-variant-key',
                prices: [
                    {
                        id: 'price1',
                        value: {
                            type: 'centPrecision',
                            currencyCode: 'USD',
                            centAmount: 1000,
                            fractionDigits: 2,
                        },
                        key: 'price-key',
                        discounted: {
                            value: {
                                type: 'centPrecision',
                                currencyCode: 'USD',
                                centAmount: 800,
                                fractionDigits: 2,
                            },
                            discount: {
                                typeId: 'discount-type',
                                id: 'discount1',
                            },
                        },
                    },
                ],
                images: [
                    {
                        url: 'http://example.com/image.jpg',
                        label: 'Example Image',
                        dimensions: { w: 100, h: 100 },
                    },
                ],
                attributes: [{ name: 'color', value: 'red' }],
                assets: [],
            },
            id: '1',
            key: 'test-key',
        };

        component.book = mockProduct;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
