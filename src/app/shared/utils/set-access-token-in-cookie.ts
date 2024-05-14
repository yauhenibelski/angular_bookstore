import * as cookieHandler from 'cookie';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token-response';
import { ANONYMOUS_TOKEN_SHORT_NAME } from '../constants/anonymous-token-short-name';

export const setAccessTokenInCookie = (
    response: AccessTokenResponseDto,
    anonymous: boolean,
): void => {
    const token = anonymous
        ? ANONYMOUS_TOKEN_SHORT_NAME + response.access_token
        : response.access_token;

    const cookies = [
        cookieHandler.serialize('accessToken', token, {
            secure: true,
            expires: new Date(Date.now() + response.expires_in),
        }),
        cookieHandler.serialize('refreshToken', response.refresh_token, {
            secure: true,
            expires: new Date(Date.now() + response.expires_in),
        }),
    ];

    cookies.forEach(newCookie => {
        document.cookie = newCookie;
    });
};
