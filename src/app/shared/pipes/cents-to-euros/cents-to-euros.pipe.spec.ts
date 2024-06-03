import { CentsToEurosPipe } from './cents-to-euros.pipe';

describe('CentsToEurosPipe', () => {
    it('create an instance', () => {
        const pipe = new CentsToEurosPipe();

        expect(pipe).toBeTruthy();
    });
});
