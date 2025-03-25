import { MALClient } from "@api/client";
import jwt from 'jsonwebtoken';
import { BASE_URL } from "@utils/constants";
import axios from "axios";
import { AuthFailed } from "@api/client";
import * as crypto from 'crypto';
import * as querystring from "node:querystring";

export class OAuth {
    private client: MALClient;

    constructor(client: MALClient) {
        this.client = client;
    }


    // Decode JWT token
    private decode_token(token: string | undefined | null) {
        if (token === undefined || token === null) {
            return null;
        }

        try {
            return jwt.decode(token) as { exp: number } | null;
        } catch (err) {
            return null;
        }
    }


    /**
     * This helper function allows you to get the expiration datetime of an access token (in unix format).
     * If you do not pass an access token, the one used when you called `auth()` will be used.
     * If you did not pass an access token to `auth()` or have not called `auth()` at all, an error will be raised.
     * 
     * @param {string} accessToken - Your access token.
     * @returns {number} - Returns the datetime in unix timestamp. If something goes wrong during decoding function will return `0`.
     */
    public async get_token_expiration(accessToken: string | undefined = undefined): Promise<number> {
        const decoded = this.decode_token(accessToken || this.client.accessToken);
        if (decoded && decoded.exp) {
            return decoded.exp;
        }
        return 0; // Consider token expired if we can't decode it
    }


    /**
     * This helper function allows you to check whether an access token has expired.
     * If you do not pass an access token, the one used when you called `auth()` will be used.
     * If you did not pass an access token to `auth()` or have not called `auth()` at all, an error will be raised.
     * 
     * @param {string} accessToken - Your access token.
     * @returns {boolean} - Returns `true` or `false` depending on whether the token has expired.
     */
    public async is_token_expired(accessToken: string | undefined = undefined): Promise<boolean> {
        const decoded = this.decode_token(accessToken || this.client.accessToken);
        if (decoded && decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return currentTime >= decoded.exp; // Check if the token is expired
        }
        return true; // Consider token expired if we can't decode it
    }


    /**
     * This helper function allows you to refresh your access token via your refresh token.
     * If you do not pass a refresh token, the one used when you called `auth()` will be used.
     * If you did not pass a refresh token to `auth()` or have not called `auth()` at all, an error will be raised.
     * 
     * @param {string} refreshToken - Your refresh token.
     * @returns {string} - Returns a new access token.
     */
    public async refresh_access_token(refreshToken: string | undefined = undefined): Promise<string> {
        if (this.client.refreshToken === undefined) {
            throw new Error("Your access token has expired but you have not set a refresh token, so we can't generate a new access token automatically.");
        }

        if (this.client.redirectUrl === undefined) {
            throw new Error("Your access token has expired but you have not set a redirect URL, so we can't generate a new access token automatically.");
        }

        if (this.client.refreshToken === undefined && refreshToken === undefined) {
            throw new Error("You did not pass a refresh token and one is also not set up with auth().");
        }

        const params = {
            refresh_token: refreshToken || this.client.refreshToken,
            client_id: this.client.getClientId(),
            client_secret: this.client.getSecretId(),
            redirect_uri: this.client.redirectUrl,
            grant_type: 'refresh_token',
        };

        try {
            const response = await axios.post(`${BASE_URL}/oauth2/token`, params);
            if (response.status !== 200) {
                throw new AuthFailed("refreshing token");
            }

            return response.data.access_token;
        } catch (error) {
            // Handle case where refresh token is expired
            if (axios.isAxiosError(error) && error.message.includes('invalid_grant')) {
                throw new Error('Refresh token expired or invalid. Please re-authenticate.');
            }

            throw error;
        }
    }

    // Function to generate a random state token (for CSRF protection)
    private generateState(): string {
        const state = crypto.randomBytes(16).toString('hex'); // Generate a random 16-byte state string
        return state;
    }

    private generatePKCE(): { code_verifier: string; code_challenge: string } {
        const code_verifier = crypto.randomBytes(64).toString("hex"); // 64-byte random string (128 hex chars)
        const code_challenge = code_verifier; // MAL only supports "plain" method

        return { code_verifier, code_challenge };
    }

    /**
     * This helper function allows you to get a link for a user to authenticate themselves.
     * If you have not passed the required parameteres when initializing MAL (Client ID, Redirect URL and Client Secret (Client Secret only if your app is `Web`))
     * then an error will be raised.
     * 
     * @returns {Promise<{ url: string, state: string, code_verifier: string }>} - Returns a Promise containing `url`, `state` and `code_verifier`. URL is your link
     * and the others you will **only need when calling verify_login()**. Pass them as arguments.
     */
    public async get_link(): Promise<{ url: string, state: string, code_verifier: string }> {
        const state = this.generateState(); // Generate CSRF protection state
        const { code_verifier, code_challenge } = this.generatePKCE(); // Generate PKCE values

        const params = {
            client_id: this.client.getClientId(),
            response_type: 'code',
            redirect_uri: this.client.redirectUrl,
            scope: 'read write',
            state: state, // Attach the state parameter
            code_challenge: code_challenge, // PKCE Challenge
            code_challenge_method: "plain", // MAL only supports "plain"    
            ...(this.client.getSecretId() && { client_secret: this.client.getSecretId() }), // Optional: Include client secret if passed
        };

        const url = `https://myanimelist.net/v1/oauth2/authorize?${querystring.stringify(params)}`;
        return { url, state, code_verifier };
    }


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
    async verify_login(code: string, state: string, code_verifier: string): Promise<{ access_token: string, refresh_token: string, token_type: string, expires: number }> {
        // Validate the state parameter for CSRF protection
        if (!state) {
            throw new Error('Invalid state parameter (possible CSRF attack)');
        }

        if (!code_verifier) {
            throw new Error("Invalid state parameter or missing code_verifier (possible CSRF attack)");
        }

        const params = new URLSearchParams({
            client_id: this.client.getClientId(),
            client_secret: this.client.getSecretId() || "", // Include empty string if no secret
            code,
            redirect_uri: this.client.redirectUrl || "https://example.com/",
            grant_type: 'authorization_code',
            code_verifier: code_verifier, // PKCE code_verifier
        });

        try {
            const response = await axios.post(
                'https://myanimelist.net/v1/oauth2/token',
                params.toString(), // Convert to URL-encoded format
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // Correct content type
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error("Something went wrong when verifying login. Either the code was invalid, you've not set up the properties properly, or MAL API is having issues.");
            }

            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                token_type: response.data.token_type,
                expires: Math.floor(Date.now() / 1000) + Number(response.data.expires_in),
            };
        } catch (error) {
            console.error('Error during token exchange:', error);
            throw error; // Re-throw for handling higher up
        }
    }

}