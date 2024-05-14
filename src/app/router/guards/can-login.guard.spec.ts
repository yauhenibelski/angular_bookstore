import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canLoginGuard } from './can-login.guard';

describe('canLoginGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => canLoginGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
