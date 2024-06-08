import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductStoreService } from './product-store.service';
import { ApiService } from '../api/api.service';

describe('ProductStoreService', () => {
    let service: ProductStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductStoreService, ApiService],
        });
        service = TestBed.inject(ProductStoreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
