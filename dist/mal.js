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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAL = exports.READING_STATUS_UPDATE = exports.READING_STATUS = exports.WATCHING_STATUS_UPDATE = exports.WATCHING_STATUS = exports.RANKING_MANGA = exports.RANKING_ANIME = exports.FIELD_PRESET = void 0;
const client_1 = require("./api/client");
const anime_1 = require("./api/anime");
const manga_1 = require("./api/manga");
const user_1 = require("./api/user");
const oauth_1 = require("./api/oauth");
const client_2 = require("./api/client");
const constants_1 = require("./utils/constants");
Object.defineProperty(exports, "FIELD_PRESET", { enumerable: true, get: function () { return constants_1.FIELD_PRESET; } });
Object.defineProperty(exports, "RANKING_ANIME", { enumerable: true, get: function () { return constants_1.RANKING_ANIME; } });
Object.defineProperty(exports, "RANKING_MANGA", { enumerable: true, get: function () { return constants_1.RANKING_MANGA; } });
Object.defineProperty(exports, "WATCHING_STATUS", { enumerable: true, get: function () { return constants_1.WATCHING_STATUS; } });
Object.defineProperty(exports, "WATCHING_STATUS_UPDATE", { enumerable: true, get: function () { return constants_1.WATCHING_STATUS_UPDATE; } });
Object.defineProperty(exports, "READING_STATUS", { enumerable: true, get: function () { return constants_1.READING_STATUS; } });
Object.defineProperty(exports, "READING_STATUS_UPDATE", { enumerable: true, get: function () { return constants_1.READING_STATUS_UPDATE; } });
class MAL {
    /**
     * Welcome to MAL.ts!
     * Before beginning, please make an app over at [MAL's website](https://myanimelist.net/apiconfig) if you haven't already.
     * `IMPORTANT` If you've selected `Web` when making your app, your app will have both a Client ID and a Client Secret. You need to pass
     * both of these to this constructor if you plan on interacting with user's lists via OAuth. If you have not selected `Web`, don't worry about Client Secret.
     *
     * @param {string} clientId - This is your client ID.
     * @param {string} clientSecret - This is your client secret. You may only need this if you plan on interacting with user's lists via MAL's OAuth.
     * @param {string} redirectUrl - This is your redirect URL for OAuth. This library supports as much of the OAuth process as it can, and thus it needs your redirect URL for your OAuth
     * process. Not required unless you plan on interacting with user's lists via MAL's OAuth.
     */
    constructor(clientId, clientSecret = undefined, redirectUrl = undefined) {
        this.client = new client_1.MALClient(clientId, clientSecret, redirectUrl);
        this.oauth = new oauth_1.OAuth(this.client);
        this.anime = new anime_1.AnimeAPI(this.client);
        this.manga = new manga_1.MangaAPI(this.client);
        this.user = new user_1.UserAPI(this.client);
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Automatically called upon object creation
                yield this.testCredentials();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * This function is responsible for testing client/user credentials.
     */
    testCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `https://api.myanimelist.net/v2/anime/35849?fields=title`;
            yield this.client.fetchData(url, "anime", 35849);
        });
    }
}
exports.MAL = MAL;
MAL.AnimeDoesNotExist = client_2.AnimeDoesNotExist;
MAL.MangaDoesNotExist = client_2.MangaDoesNotExist;
MAL.InvalidCredentials = client_2.InvalidCredentials;
MAL.AuthFailed = client_2.AuthFailed;
MAL.RefreshTokenExpired = client_2.RefreshTokenExpired;
//# sourceMappingURL=mal.js.map