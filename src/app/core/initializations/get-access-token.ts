import { ApiService } from 'src/app/shared/services/api/api.service';
import * as cookieHandler from 'cookie';
import { ANONYMOUS_TOKEN_SHORT_NAME } from 'src/app/shared/constants/short-names';
import { EMPTY, catchError, retry, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart/cart.service';

export function getAccessToken(
    apiService: ApiService,
    authService: AuthService,
    cartService: CartService,
) {
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
                    tap({
                        next: cartRes => {
                            const cart = cartRes.results.reverse()[0] ?? null;

                            cartService.setCart(cart);
                        },
                        error: () => {
                            authService.setLoginStatus(false);
                        },
                    }),
                    catchError(() => EMPTY),
                );
            }
        }

        return authService.getAccessAnonymousToken().pipe(
            retry(1),
            catchError(() => EMPTY),
        );
    };
}
