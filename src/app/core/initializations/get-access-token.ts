import { ApiService } from 'src/app/shared/services/api/api.service';
import * as cookieHandler from 'cookie';

export function getAccessToken(apiService: ApiService) {
    return () => {
        const documentCookie = cookieHandler.parse(document.cookie);

        if ('accessToken' in documentCookie) {
            apiService.setAccessToken(documentCookie['accessToken']);

            apiService.setProjectSettings();
            apiService.createAnonymousCart();
        }

        if (!('accessToken' in documentCookie)) {
            apiService.getAccessToken().subscribe(response => {
                const cookies = [
                    cookieHandler.serialize('accessToken', response.access_token, {
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

                apiService.setAccessToken(response.access_token);

                apiService.setProjectSettings();
                apiService.createAnonymousCart();
            });
        }
    };
}
