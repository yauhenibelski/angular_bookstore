import { ApiService } from 'src/app/shared/services/api/api.service';
import * as cookieHandler from 'cookie';
import { ANONYMOUS_TOKEN_SHORT_NAME } from 'src/app/shared/constants/anonymous-token-short-name';
import { setAccessTokenInCookie } from 'src/app/shared/utils/set-access-token-in-cookie';
import { switchMap, tap } from 'rxjs';
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
                apiService.setAccessToken(accessToken.replace(ANONYMOUS_TOKEN_SHORT_NAME, ''));
                apiService.createAnonymousCart();
            }

            if (!isAnonymousToken) {
                apiService.setAccessToken(accessToken);
                apiService
                    .getCustomerByPasswordFlowToken()
                    .pipe(
                        tap(() => {
                            authService.setLoginStatus(true);
                        }),
                        switchMap(() => apiService.getCartByPasswordFlowToken()),
                    )
                    .subscribe(cartRes => {
                        const cart = cartRes.results.reverse()[0] ?? null;

                        cartService.setCart(cart);
                    });
            }

            apiService.setProjectSettings();
        }

        if (!('accessToken' in documentCookie)) {
            apiService.getAccessToken().subscribe(response => {
                setAccessTokenInCookie(response, true);

                apiService.setAccessToken(response.access_token);

                apiService.setProjectSettings();
                apiService.createAnonymousCart();
            });
        }
    };
}
