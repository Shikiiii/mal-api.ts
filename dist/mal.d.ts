import { AnimeAPI } from "./api/anime";
import { MangaAPI } from "./api/manga";
import { UserAPI } from "./api/user";
import { OAuth } from "./api/oauth";
import { AnimeDoesNotExist, MangaDoesNotExist, InvalidCredentials, AuthFailed, RefreshTokenExpired } from "./api/client";
import { FIELD_PRESET, RANKING_ANIME, RANKING_MANGA, WATCHING_STATUS, WATCHING_STATUS_UPDATE, READING_STATUS, READING_STATUS_UPDATE } from "./utils/constants";
export { FIELD_PRESET, RANKING_ANIME, RANKING_MANGA, WATCHING_STATUS, WATCHING_STATUS_UPDATE, READING_STATUS, READING_STATUS_UPDATE };
export declare class MAL {
    private client;
    anime: AnimeAPI;
    manga: MangaAPI;
    user: UserAPI;
    oauth: OAuth;
    static AnimeDoesNotExist: typeof AnimeDoesNotExist;
    static MangaDoesNotExist: typeof MangaDoesNotExist;
    static InvalidCredentials: typeof InvalidCredentials;
    static AuthFailed: typeof AuthFailed;
    static RefreshTokenExpired: typeof RefreshTokenExpired;
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
    constructor(clientId: string, clientSecret?: string | undefined, redirectUrl?: string | undefined);
    private initialize;
    /**
     * This function is responsible for testing client/user credentials.
     */
    private testCredentials;
}
