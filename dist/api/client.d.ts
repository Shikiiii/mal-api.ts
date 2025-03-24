import { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired } from "../utils/errors";
export { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired };
export declare class MALClient {
    private clientId;
    private clientSecret;
    accessToken: string | undefined | null;
    refreshToken: string | undefined;
    redirectUrl: string | undefined;
    constructor(clientId: string, clientSecret: string | undefined, redirectUrl: string | undefined);
    getClientId(): string;
    getSecretId(): string | undefined;
    /**
     * Fetches data from the MyAnimeList API.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint.
     * @param {string} id__q - This is the query or ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    fetchData<T>(url: string, endpoint: string, id__q?: string | number): Promise<T | null>;
    /**
     * Updates lists.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    updateList<T>(url: string, endpoint: string, id: string | number, params: URLSearchParams): Promise<T | null>;
    /**
     * Deletes an entry from a user's list.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<true | false>} The API response or `null` if an error occurs.
     */
    deleteEntry<T>(url: string, endpoint: string, id: string | number): Promise<true | false>;
}
