import { ApiService } from 'src/app/shared/services/api/api.service';
import * as cookieHandler from 'cookie';
import { ANONYMOUS_TOKEN_SHORT_NAME } from 'src/app/shared/constants/short-names';
import { switchMap } from 'rxjs';
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

                apiService.createAnonymousCart();
            }

            if (!isAnonymousToken) {
                authService.setToken(documentCookie);
                authService.setLoginStatus(true);
                apiService
                    .getCustomerByPasswordFlowToken()
                    .pipe(switchMap(() => apiService.getCartByPasswordFlowToken()))
                    .subscribe({
                        next: cartRes => {
                            const cart = cartRes.results.reverse()[0] ?? null;

                            cartService.setCart(cart);
                        },
                        error: () => {
                            authService.setLoginStatus(false);
                        },
                    });
            }
        }

        if (!('accessToken' in documentCookie)) {
            authService.getAccessAnonymousToken().subscribe();
        }
    };
}
