import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { updateTokenInterceptor } from './update-token.interceptor';

describe('updateTokenInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => updateTokenInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});
