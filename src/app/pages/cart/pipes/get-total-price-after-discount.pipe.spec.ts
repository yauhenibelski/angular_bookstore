import { GetTotalPriceAfterDiscountPipe } from './get-total-price-after-discount.pipe';

describe('GetTotalPriceAfterDiscountPipe', () => {
    it('create an instance', () => {
        const pipe = new GetTotalPriceAfterDiscountPipe();

        expect(pipe).toBeTruthy();
    });
});
