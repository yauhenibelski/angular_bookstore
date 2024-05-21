export interface AccessToken {
    access: string | undefined | null;
    refresh: string | undefined | null;
}

export interface RefreshTokenResponseDto {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export interface AccessTokenResponseDto extends RefreshTokenResponseDto {
    refresh_token: string;
}
