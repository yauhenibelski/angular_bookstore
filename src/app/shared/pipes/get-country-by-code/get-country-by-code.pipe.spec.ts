import { GetCountryByCodePipe } from './get-country-by-code.pipe';

describe('GetCountryByCodePipe', () => {
    it('create an instance', () => {
        const pipe = new GetCountryByCodePipe();

        expect(pipe).toBeTruthy();
    });
});
