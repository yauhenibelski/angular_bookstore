import { tap } from 'rxjs';
import { AuthApiService } from 'src/app/shared/services/auth-api/auth-api.service';
import * as cookieHandler from 'cookie';
import { HostApiService } from 'src/app/shared/services/host-api/host-api.service';

export function getAccessToken(authApiService: AuthApiService, hostApiService: HostApiService) {
    return () =>
        authApiService.accessToken$.pipe(
            tap(accessToken => {
                const documentCookie = cookieHandler.parse(document.cookie);

                if (!('accessToken' in documentCookie)) {
                    const cookies = [
                        cookieHandler.serialize('accessToken', accessToken.access_token, {
                            secure: true,
                            expires: new Date(Date.now() + accessToken.expires_in),
                        }),
                        cookieHandler.serialize('accessTokenType', accessToken.token_type, {
                            secure: true,
                            expires: new Date(Date.now() + accessToken.expires_in),
                        }),
                    ];

                    cookies.forEach(newCookie => {
                        document.cookie = newCookie;
                    });
                }

                if ('accessToken' in documentCookie) {
                    authApiService.setAccessToken(documentCookie['accessToken']);
                    hostApiService.setAccessToken(documentCookie['accessToken']);
                }
            }),
        );
}
