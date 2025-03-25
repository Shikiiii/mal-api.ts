var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MALClient } from "./api/client.js";
import { AnimeAPI } from "./api/anime.js";
import { MangaAPI } from "./api/manga.js";
import { UserAPI } from "./api/user.js";
import { OAuth } from "./api/oauth.js";
import { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, AuthFailed, RefreshTokenExpired } from "./api/client.js";
import { FIELD_PRESET, RANKING_ANIME, RANKING_MANGA, WATCHING_STATUS, WATCHING_STATUS_UPDATE, READING_STATUS, READING_STATUS_UPDATE } from "./utils/constants.js";
export { FIELD_PRESET, RANKING_ANIME, RANKING_MANGA, WATCHING_STATUS, WATCHING_STATUS_UPDATE, READING_STATUS, READING_STATUS_UPDATE };
export class MAL {
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
        this.client = new MALClient(clientId, clientSecret, redirectUrl);
        this.oauth = new OAuth(this.client);
        this.anime = new AnimeAPI(this.client);
        this.manga = new MangaAPI(this.client);
        this.user = new UserAPI(this.client);
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
MAL.AnimeDoesNotExist = AnimeDoesNotExist;
MAL.MangaDoesNotExist = MangaDoesNotExist;
MAL.InvalidCredentials = InvalidCredentials;
MAL.AuthFailed = AuthFailed;
MAL.RefreshTokenExpired = RefreshTokenExpired;
//# sourceMappingURL=mal.js.map