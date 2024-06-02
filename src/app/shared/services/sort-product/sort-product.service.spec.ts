import { TestBed } from '@angular/core/testing';

import { SortProductService } from './sort-product.service';

describe('SortProductService', () => {
    let service: SortProductService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SortProductService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
