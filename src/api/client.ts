import axios from "axios";
import { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired } from "../utils/errors";
export { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired }; // Re-export the error classes

export class MALClient {
    private clientId: string;
    private clientSecret: string | undefined;
    public accessToken: string | undefined | null;
    public refreshToken: string | undefined;
    public redirectUrl: string | undefined;

    constructor(clientId: string, clientSecret: string | undefined, redirectUrl: string | undefined) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }

    getClientId() {
        return this.clientId;
    }

    getSecretId() {
        return this.clientSecret
    }

    /**
     * Fetches data from the MyAnimeList API.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint.
     * @param {string} id__q - This is the query or ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    async fetchData<T>(url: string, endpoint: string, id__q: string | number = 0): Promise<T | null> {
        try {
            let headers = this.accessToken
                ? { Authorization: `Bearer ${this.accessToken}` }
                : { "X-MAL-Client-ID": this.clientId };

            const response = await axios.get<T>(url, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            // Narrow down the error type to axios error
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    if (endpoint === "anime") {
                        throw new AnimeDoesNotExist(id__q);
                    } else if (endpoint === "manga") {
                        throw new MangaDoesNotExist(id__q);
                    } else if (endpoint === "user") {
                        throw new UserError(id__q);
                    }
                    throw new AnimeDoesNotExist(id__q);
                } else if (error.response.status === 400) {
                    throw new InvalidCredentials(this.clientId);
                } else if (error.response.status === 401) {
                    throw new AuthFailed(this.clientId);
                }
            }

            // Catch any unknown errors and log the custom message
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }


    /**
     * Updates lists.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    async updateList<T>(url: string, endpoint: string, id: string | number, params: URLSearchParams): Promise<T | null> {
        if (this.accessToken === undefined) {
            throw new AuthFailed(this.clientId);
        }

        try {
            const response = await axios.put(url, params.toString(), {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`, // Ensure the token is set
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            return response.data;
        }
        catch (error) {
            // Narrow down the error type to axios error
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new AuthFailed(this.clientId);
                } else if (error.response.status === 400) {
                    throw new InvalidCredentials(this.clientId);
                } else if (endpoint === "anime" && error.response.status === 404) {
                    throw new AnimeDoesNotExist(id);
                } else if (endpoint === "manga" && error.response.status === 404) {
                    throw new MangaDoesNotExist(id);
                }
            }

            throw new Error(`Failed to fetch data: ${error}`);
        }
    }


    /**
     * Deletes an entry from a user's list.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<true | false>} The API response or `null` if an error occurs.
     */
    async deleteEntry<T>(url: string, endpoint: string, id: string | number): Promise<true | false> {
        if (this.accessToken === undefined) {
            throw new AuthFailed(this.clientId);
        }

        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            return true;
        }
        catch (error) {
            // Narrow down the error type to axios error
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new AuthFailed(this.clientId);
                } else if (error.response.status === 400) {
                    throw new InvalidCredentials(this.clientId);
                }
            }

            return false;
        }
    }
}
