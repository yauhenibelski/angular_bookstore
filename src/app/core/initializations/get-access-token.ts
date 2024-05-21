import { ApiService } from 'src/app/shared/services/api/api.service';
import * as cookieHandler from 'cookie';
import { ANONYMOUS_TOKEN_SHORT_NAME } from 'src/app/shared/constants/short-names';
import { EMPTY, catchError, retry, switchMap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

export function getAccessToken(apiService: ApiService, authService: AuthService) {
    return () => {
        const documentCookie = cookieHandler.parse(document.cookie);

        if ('accessToken' in documentCookie) {
            const accessToken = documentCookie['accessToken'];
            const isAnonymousToken = accessToken.startsWith(ANONYMOUS_TOKEN_SHORT_NAME);

            if (isAnonymousToken) {
                documentCookie['accessToken'] = accessToken.replace(ANONYMOUS_TOKEN_SHORT_NAME, '');

                authService.setToken(documentCookie);

                return apiService.createAnonymousCart().pipe(
                    retry(1),
                    catchError(() => EMPTY),
                );
            }

            if (!isAnonymousToken) {
                authService.setToken(documentCookie);
                authService.setLoginStatus(true);

                return apiService.getCustomerByPasswordFlowToken().pipe(
                    switchMap(() => apiService.getCartByPasswordFlowToken()),
                    retry(1),
                    catchError(() => {
                        authService.setLoginStatus(false);

                        return EMPTY;
                    }),
                );
            }
        }

        return authService.getAccessAnonymousToken().pipe(
            retry(1),
            catchError(() => EMPTY),
        );
    };
}
