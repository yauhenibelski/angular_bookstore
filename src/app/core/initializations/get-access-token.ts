import { Observable, tap } from 'rxjs';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token-response';
import { AuthApiService } from 'src/app/shared/auth-api-service/auth-api.service';
import * as cookieHandler from 'cookie';

export function getAccessToken(
    authService: AuthApiService,
): () => Observable<AccessTokenResponseDto> {
    return () =>
        authService.accessToken$.pipe(
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
                    authService.accessToken = documentCookie['accessToken'];
                }
            }),
        );
}
