import { MALClient } from "./client.js";
export declare class OAuth {
    private client;
    constructor(client: MALClient);
    private decode_token;
    /**
     * This helper function allows you to get the expiration datetime of an access token (in unix format).
     * If you do not pass an access token, the one used when you called `auth()` will be used.
     * If you did not pass an access token to `auth()` or have not called `auth()` at all, an error will be raised.
     *
     * @param {string} accessToken - Your access token.
     * @returns {number} - Returns the datetime in unix timestamp. If something goes wrong during decoding function will return `0`.
     */
    get_token_expiration(accessToken?: string | undefined): Promise<number>;
    /**
     * This helper function allows you to check whether an access token has expired.
     * If you do not pass an access token, the one used when you called `auth()` will be used.
     * If you did not pass an access token to `auth()` or have not called `auth()` at all, an error will be raised.
     *
     * @param {string} accessToken - Your access token.
     * @returns {boolean} - Returns `true` or `false` depending on whether the token has expired.
     */
    is_token_expired(accessToken?: string | undefined): Promise<boolean>;
    /**
     * This helper function allows you to refresh your access token via your refresh token.
     * If you do not pass a refresh token, the one used when you called `auth()` will be used.
     * If you did not pass a refresh token to `auth()` or have not called `auth()` at all, an error will be raised.
     *
     * @param {string} refreshToken - Your refresh token.
     * @returns {string} - Returns a new access token.
     */
    refresh_access_token(refreshToken?: string | undefined): Promise<string>;
    private generateState;
    private generatePKCE;
    /**
     * This helper function allows you to get a link for a user to authenticate themselves.
     * If you have not passed the required parameteres when initializing MAL (Client ID, Redirect URL and Client Secret (Client Secret only if your app is `Web`))
     * then an error will be raised.
     *
     * @returns {Promise<{ url: string, state: string, code_verifier: string }>} - Returns a Promise containing `url`, `state` and `code_verifier`. URL is your link
     * and the others you will **only need when calling verify_login()**. Pass them as arguments.
     */
    get_link(): Promise<{
        url: string;
        state: string;
        code_verifier: string;
    }>;
    /**
     * This helper function allows you to exchange the code you receive in URL parameters for an Access & Refresh token after user authenticates themselves.
     * `IMPORTANT!` Make sure to store these securely and don't expose them to the end user.
     * `IMPORTANT!` According to MAL docs, an access token lasts 1 hour, but it currently lasts the same as the refresh token (31 days).
     * This may change in the future so do not rely on it.
     * @param {string} code - The code you receive when redirected back to your Redirect URL.
     * @param {string} state - The state you got when you called `get_link()`.
     * @param {string} code_verifier - The code verifier you got when you called `get_link()`.
     *
     * @returns {Promise<{ access_token: string, refresh_token: string, token_type: string, expires: number }>} - Returns a promise.
     * `access_token` is your access token, `refresh_token` is your refresh token, `token_type` is your token type (usually Bearer) and `expires` is the datetime at which
     * your **refresh** token expires (in unix format).
     */
    verify_login(code: string, state: string, code_verifier: string): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires: number;
    }>;
}
