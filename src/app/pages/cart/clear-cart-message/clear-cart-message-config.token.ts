import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

export const CLEAR_CART_MASSAGE: InjectionToken<MatDialogConfig<unknown>> = new InjectionToken(
    'Clear cart message',
    { factory: () => ({ id: 'CLEAR_CART_MASSAGE' }) },
);
