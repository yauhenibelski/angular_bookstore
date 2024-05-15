import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export const canLoginGuard: CanActivateFn = (_route, _state) => {
    const isLogined = inject(AuthService).isLogined;
    const urlTree = inject(Router).createUrlTree(['/main']);

    return isLogined.pipe(map(boolean => !boolean || urlTree));
};
