"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MALClient = exports.RefreshTokenExpired = exports.AuthFailed = exports.UserError = exports.InvalidCredentials = exports.MangaDoesNotExist = exports.AnimeDoesNotExist = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../utils/errors");
Object.defineProperty(exports, "AnimeDoesNotExist", { enumerable: true, get: function () { return errors_1.AnimeDoesNotExist; } });
Object.defineProperty(exports, "MangaDoesNotExist", { enumerable: true, get: function () { return errors_1.MangaDoesNotExist; } });
Object.defineProperty(exports, "InvalidCredentials", { enumerable: true, get: function () { return errors_1.InvalidCredentials; } });
Object.defineProperty(exports, "UserError", { enumerable: true, get: function () { return errors_1.UserError; } });
Object.defineProperty(exports, "AuthFailed", { enumerable: true, get: function () { return errors_1.AuthFailed; } });
Object.defineProperty(exports, "RefreshTokenExpired", { enumerable: true, get: function () { return errors_1.RefreshTokenExpired; } });
class MALClient {
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
                const response = yield axios_1.default.get(url, {
                    headers: headers,
                });
                return response.data;
            }
            catch (error) {
                // Narrow down the error type to axios error
                if (axios_1.default.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        if (endpoint === "anime") {
                            throw new errors_1.AnimeDoesNotExist(id__q);
                        }
                        else if (endpoint === "manga") {
                            throw new errors_1.MangaDoesNotExist(id__q);
                        }
                        else if (endpoint === "user") {
                            throw new errors_1.UserError(id__q);
                        }
                        throw new errors_1.AnimeDoesNotExist(id__q);
                    }
                    else if (error.response.status === 400) {
                        throw new errors_1.InvalidCredentials(this.clientId);
                    }
                    else if (error.response.status === 401) {
                        throw new errors_1.AuthFailed(this.clientId);
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
                throw new errors_1.AuthFailed(this.clientId);
            }
            try {
                const response = yield axios_1.default.put(url, params.toString(), {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`, // Ensure the token is set
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                return response.data;
            }
            catch (error) {
                // Narrow down the error type to axios error
                if (axios_1.default.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        throw new errors_1.AuthFailed(this.clientId);
                    }
                    else if (error.response.status === 400) {
                        throw new errors_1.InvalidCredentials(this.clientId);
                    }
                    else if (endpoint === "anime" && error.response.status === 404) {
                        throw new errors_1.AnimeDoesNotExist(id);
                    }
                    else if (endpoint === "manga" && error.response.status === 404) {
                        throw new errors_1.MangaDoesNotExist(id);
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
                throw new errors_1.AuthFailed(this.clientId);
            }
            try {
                yield axios_1.default.delete(url, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                });
                return true;
            }
            catch (error) {
                // Narrow down the error type to axios error
                if (axios_1.default.isAxiosError(error) && error.response) {
                    if (error.response.status === 401) {
                        throw new errors_1.AuthFailed(this.clientId);
                    }
                    else if (error.response.status === 400) {
                        throw new errors_1.InvalidCredentials(this.clientId);
                    }
                }
                return false;
            }
        });
    }
}
exports.MALClient = MALClient;
//# sourceMappingURL=client.js.map