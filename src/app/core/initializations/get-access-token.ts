import { tap } from 'rxjs';
import { AuthApiService } from 'src/app/shared/services/auth-api/auth-api.service';
import * as cookieHandler from 'cookie';
import { HostApiService } from 'src/app/shared/services/host-api/host-api.service';

export function getAccessToken(authApiService: AuthApiService, hostApiService: HostApiService) {
    return () =>
        authApiService.accessToken$.pipe(
            tap(response => {
                const documentCookie = cookieHandler.parse(document.cookie);

                if (!('accessToken' in documentCookie)) {
                    const cookies = [
                        cookieHandler.serialize('accessToken', response.access_token, {
                            secure: true,
                            expires: new Date(Date.now() + response.expires_in),
                        }),
                        cookieHandler.serialize('accessTokenType', response.token_type, {
                            secure: true,
                            expires: new Date(Date.now() + response.expires_in),
                        }),
                    ];

                    cookies.forEach(newCookie => {
                        document.cookie = newCookie;
                    });

                    authApiService.setAccessToken(response.access_token);
                    hostApiService.setAccessToken(response.access_token);
                }

                if ('accessToken' in documentCookie) {
                    authApiService.setAccessToken(documentCookie['accessToken']);
                    hostApiService.setAccessToken(documentCookie['accessToken']);
                }
            }),
        );
}
