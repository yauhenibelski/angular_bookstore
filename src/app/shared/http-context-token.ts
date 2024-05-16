import { HttpContextToken } from '@angular/common/http';

export const TOKEN_TYPE_CONTEXT = new HttpContextToken<'Bearer' | 'Basic'>(() => 'Basic');
