import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart, UpdatePayload } from './cart.interface';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CartService],
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create anonymous cart', () => {
        const dummyCart: Cart = {
            type: 'Cart',
            id: '123',
            version: 1,
            createdAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lineItems: [],
            cartState: 'Active',
            totalPrice: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 0,
                fractionDigits: 2,
            },
            shippingMode: 'Standard',
            shipping: [],
            customLineItems: [],
            discountCodes: [],
            directDiscounts: [],
            inventoryMode: 'None',
            taxMode: 'Platform',
            taxRoundingMode: 'HalfEven',
            taxCalculationMode: 'LineItemLevel',
            refusedGifts: [],
            origin: 'Customer',
            itemShippingAddresses: [],
        };

        service.createAnonymousCart().subscribe(cart => {
            expect(cart).toEqual(dummyCart);
        });

        const req = httpMock.expectOne('/carts');

        expect(req.request.method).toBe('POST');
        req.flush(dummyCart);
    });

    it('should return true if product is in cart', () => {
        const dummyProduct: Product = {
            id: '456',
            productId: '456',
            key: 'test-product-key',
            name: { en: 'Test Product' },
            description: { en: 'Description' },
            categories: [],
            slug: { en: 'test-product' },
            categoryOrderHints: {},
            variants: [],
            searchKeywords: {},
            masterVariant: {
                id: 1,
                key: 'key',
                prices: [],
                images: [],
                attributes: [],
                assets: [],
            },
        };

        const dummyCart: Cart = {
            type: 'Cart',
            id: '123',
            version: 1,
            createdAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lineItems: [dummyProduct],
            cartState: 'Active',
            totalPrice: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 0,
                fractionDigits: 2,
            },
            shippingMode: 'Standard',
            shipping: [],
            customLineItems: [],
            discountCodes: [],
            directDiscounts: [],
            inventoryMode: 'None',
            taxMode: 'Platform',
            taxRoundingMode: 'HalfEven',
            taxCalculationMode: 'LineItemLevel',
            refusedGifts: [],
            origin: 'Customer',
            itemShippingAddresses: [],
        };

        (service as unknown as { cartSignal: { set: (value: Cart) => void } }).cartSignal.set(
            dummyCart,
        );

        const hasProduct = service.hasProductInCart('456');

        expect(hasProduct()).toBe(true);
    });

    it('should return false if product is not in cart', () => {
        const dummyProduct: Product = {
            id: '789',
            productId: '789',
            key: 'another-product-key',
            name: { en: 'Another Product' },
            description: { en: 'Description' },
            categories: [],
            slug: { en: 'another-product' },
            categoryOrderHints: {},
            variants: [],
            searchKeywords: {},
            masterVariant: {
                id: 1,
                key: 'key',
                prices: [],
                images: [],
                attributes: [],
                assets: [],
            },
        };

        const dummyCart: Cart = {
            type: 'Cart',
            id: '123',
            version: 1,
            createdAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lineItems: [dummyProduct],
            cartState: 'Active',
            totalPrice: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 0,
                fractionDigits: 2,
            },
            shippingMode: 'Standard',
            shipping: [],
            customLineItems: [],
            discountCodes: [],
            directDiscounts: [],
            inventoryMode: 'None',
            taxMode: 'Platform',
            taxRoundingMode: 'HalfEven',
            taxCalculationMode: 'LineItemLevel',
            refusedGifts: [],
            origin: 'Customer',
            itemShippingAddresses: [],
        };

        (service as unknown as { cartSignal: { set: (value: Cart) => void } }).cartSignal.set(
            dummyCart,
        );

        const hasProduct = service.hasProductInCart('456');

        expect(hasProduct()).toBe(false);
    });

    it('should handle updateCart for addLineItem action', () => {
        const dummyCart: Cart = {
            type: 'Cart',
            id: '123',
            version: 1,
            createdAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lineItems: [],
            cartState: 'Active',
            totalPrice: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 0,
                fractionDigits: 2,
            },
            shippingMode: 'Standard',
            shipping: [],
            customLineItems: [],
            discountCodes: [],
            directDiscounts: [],
            inventoryMode: 'None',
            taxMode: 'Platform',
            taxRoundingMode: 'HalfEven',
            taxCalculationMode: 'LineItemLevel',
            refusedGifts: [],
            origin: 'Customer',
            itemShippingAddresses: [],
        };

        (service as unknown as { cartSignal: { set: (value: Cart) => void } }).cartSignal.set(
            dummyCart,
        );

        const payload: UpdatePayload = { productId: '456' };

        service.updateCart('addLineItem', payload);

        const dummyProduct: Product = {
            id: '456',
            productId: '456',
            key: 'test-product-key',
            name: { en: 'Test Product' },
            description: { en: 'Description' },
            categories: [],
            slug: { en: 'test-product' },
            categoryOrderHints: {},
            variants: [],
            searchKeywords: {},
            masterVariant: {
                id: 1,
                key: 'key',
                prices: [],
                images: [],
                attributes: [],
                assets: [],
            },
        };

        const req = httpMock.expectOne(`/carts/${dummyCart.id}`);

        expect(req.request.method).toBe('POST');
        req.flush({ ...dummyCart, lineItems: [dummyProduct] });

        expect((service as unknown as { cartSignal: { (): Cart } }).cartSignal()).toEqual({
            ...dummyCart,
            lineItems: [dummyProduct],
        });
    });

    it('should handle updateCart error', () => {
        const dummyCart: Cart = {
            type: 'Cart',
            id: '123',
            version: 1,
            createdAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lineItems: [],
            cartState: 'Active',
            totalPrice: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 0,
                fractionDigits: 2,
            },
            shippingMode: 'Standard',
            shipping: [],
            customLineItems: [],
            discountCodes: [],
            directDiscounts: [],
            inventoryMode: 'None',
            taxMode: 'Platform',
            taxRoundingMode: 'HalfEven',
            taxCalculationMode: 'LineItemLevel',
            refusedGifts: [],
            origin: 'Customer',
            itemShippingAddresses: [],
        };

        (service as unknown as { cartSignal: { set: (value: Cart) => void } }).cartSignal.set(
            dummyCart,
        );

        const payload: UpdatePayload = { productId: '456' };

        let errorHandled = false;

        service.updateCart('addLineItem', payload, error => {
            errorHandled = true;

            if (error) {
                expect((error as HttpErrorResponse).status).toBe(500);
            }
        });

        const req = httpMock.expectOne(`/carts/${dummyCart.id}`);

        expect(req.request.method).toBe('POST');
        req.flush('Error', { status: 500, statusText: 'Server Error' });

        expect(errorHandled).toBe(true);
    });
});
