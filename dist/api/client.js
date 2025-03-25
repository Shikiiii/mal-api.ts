var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired } from "../utils/errors.js";
export { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, UserError, AuthFailed, RefreshTokenExpired }; // Re-export the error classes
export class MALClient {
    constructor(clientId, clientSecret, redirectUrl) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }
    getClientId() {
        return this.clientId;
    }
    getSecretId() {
        return this.clientSecret;
    }
    /**
     * Fetches data from the MyAnimeList API.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint.
     * @param {string} id__q - This is the query or ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    fetchData(url_1, endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (url, endpoint, id__q = 0) {
            try {
                let headers = this.accessToken
                    ? { Authorization: `Bearer ${this.accessToken}` }
                    : { "X-MAL-Client-ID": this.clientId };
                const response = yield axios.get(url, {
                    headers: headers,
                });
                return response.data;
            }
            catch (error) {
                // Narrow down the error type to axios error
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        if (endpoint === "anime") {
                            throw new AnimeDoesNotExist(id__q);
                        }
                        else if (endpoint === "manga") {
                            throw new MangaDoesNotExist(id__q);
                        }
                        else if (endpoint === "user") {
                            throw new UserError(id__q);
                        }
                        throw new AnimeDoesNotExist(id__q);
                    }
                    else if (error.response.status === 400) {
                        throw new InvalidCredentials(this.clientId);
                    }
                    else if (error.response.status === 401) {
                        throw new AuthFailed(this.clientId);
                    }
                }
                // Catch any unknown errors and log the custom message
                throw new Error(`Failed to fetch data: ${error}`);
            }
        });
    }
    /**
     * Updates lists.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<T | null>} The API response or `null` if an error occurs.
     */
    updateList(url, endpoint, id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessToken === undefined) {
                throw new AuthFailed(this.clientId);
            }
            try {
                const response = yield axios.put(url, params.toString(), {
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
                    }
                    else if (error.response.status === 400) {
                        throw new InvalidCredentials(this.clientId);
                    }
                    else if (endpoint === "anime" && error.response.status === 404) {
                        throw new AnimeDoesNotExist(id);
                    }
                    else if (endpoint === "manga" && error.response.status === 404) {
                        throw new MangaDoesNotExist(id);
                    }
                }
                throw new Error(`Failed to fetch data: ${error}`);
            }
        });
    }
    /**
     * Deletes an entry from a user's list.
     * @param {string} url - The API endpoint.
     * @param {string} endpoint - The specific endpoint (anime || manga).
     * @param {string} id - This is the ID used for erroring.
     * @returns {Promise<true | false>} The API response or `null` if an error occurs.
     */
    deleteEntry(url, endpoint, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessToken === undefined) {
                throw new AuthFailed(this.clientId);
            }
            try {
                yield axios.delete(url, {
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
                    }
                    else if (error.response.status === 400) {
                        throw new InvalidCredentials(this.clientId);
                    }
                }
                return false;
            }
        });
    }
}
//# sourceMappingURL=client.js.map