import { HttpContextToken } from '@angular/common/http';

export const IS_FILTER_DISABLED = new HttpContextToken<boolean>(() => true);
