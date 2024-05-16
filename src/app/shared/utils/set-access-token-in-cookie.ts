import * as cookieHandler from 'cookie';
import { AccessTokenResponseDto } from 'src/app/interfaces/access-token';
import {
    ANONYMOUS_TOKEN_SHORT_NAME,
    accessTokenName,
    refreshTokenName,
} from '../constants/short-names';

const TEN_HOURS = 36000;

export const setAccessTokenInCookie = (
    response: AccessTokenResponseDto,
    anonymous: boolean,
): void => {
    const token = anonymous
        ? ANONYMOUS_TOKEN_SHORT_NAME + response.access_token
        : response.access_token;

    const cookies = [
        cookieHandler.serialize(accessTokenName, token, {
            secure: true,
            maxAge: response.expires_in,
        }),
        cookieHandler.serialize(refreshTokenName, response.refresh_token, {
            secure: true,
            maxAge: response.expires_in + TEN_HOURS,
        }),
    ];

    cookies.forEach(newCookie => {
        document.cookie = newCookie;
    });
};
