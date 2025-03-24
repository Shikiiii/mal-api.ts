import { MALClient } from "./client";
import { ANIME_FIELDS, MANGA_FIELDS, WATCHING_STATUS, WATCHING_STATUS_UPDATE, READING_STATUS_UPDATE, READING_STATUS } from "../utils/constants";
import { Anime } from "../models/anime";
import { Manga } from "../models/manga";
import { User, AnimeList, MangaList, AnimeEntry, MangaEntry } from "../models/user";
export declare class UserAPI {
    private client;
    animelist: UserAnimeListAPI;
    mangalist: UserMangaListAPI;
    private main;
    constructor(client: MALClient);
    /**
     * Authenticate a user using an access token.
     * You only need to call this once.
     *
     * @param {string} accessToken - Access token.
     * @param {string} refreshToken - Refresh token.
     */
    auth(accessToken: string, refreshToken?: string | undefined): Promise<void>;
    /**
     * Get user's information.
     * Please note that you must have ran `auth()` before this.
     * It is not possible to fetch the information for a user if not authenticated. This is MAL limitations.
     *
     * @returns {Promise<User | null>} - Returns a promise that resolves to an `User` object, or `null` if MAL API is having issues.
     */
    info(): Promise<User | null>;
    private mapSearchResults;
    next(url: string, query: string): Promise<AnimeList<Anime>>;
    prev(url: string, query: string): Promise<AnimeList<Anime>>;
    /**
     * Get anime suggested for user based on their list.
     * Please note: this only works if you're using a user's access token.
     *
     * @param {Object} options - The options for the suggested anime.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 100. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the anime details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<AnimeList<Anime> | null>} - Returns a promise that resolves to an `AnimeList` object, or `null` if MAL API is having issues.
     */
    suggested({ limit, offset, fieldPreset, extraFields, }?: {
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeList<Anime> | null>;
}
declare class UserAnimeListAPI {
    private client;
    private main;
    constructor(client: MALClient, main: UserAPI);
    private mapSearchResults;
    next(url: string, query: string): Promise<AnimeList<Anime>>;
    prev(url: string, query: string): Promise<AnimeList<Anime>>;
    /**
     * Get user anime list.
     * Please note: you may access public lists without the need for the user to be authenticated by passing the `username` argument.
     * But, `my_list_status` will be `undefined` if not authenticated. This is MAL limitations.
     *
     * @param {Object} options - The options for the query.
     * @param {string} [options.username="@me"] - The username of the person you want to fetch the list from. This endpoint does not require authentication so you can pass any username. But if you are authenticated, then you can pass `"@me"` for the authenticated user list. Note that if a user's anime list is set to private, you may not access it without authentication. Defaults to `"@me"`.
     * @param {string} [options.status="all"] - The status to fetch the list from. You can use the enum `WATCHING_STATUS` instead of a string. It is automatically imported. Defaults to `"all"`. Can be either `"all"`, `"watching"`, `"completed"`, `"on_hold"`, `"dropped"`, `"plan_to_watch"`.
     * @param {string} [options.sort="default"] - The way results should be sorted. Defaults to `"default"`. Can be either `"list_score"` (Desc), `"list_updated_at"` (Desc), `"anime_title"` (Asc), `"anime_start_date"` (Desc).
     * @param {number} [options.limit=100] - The number of items. Can be between `1` and `1000`. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the anime details. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<AnimeList<Anime> | null>} - Returns a promise that resolves to an `AnimeList` object, or `null` if MAL API is having issues.
     */
    get({ username, status, sort, limit, offset, fieldPreset, extraFields, }?: {
        username?: string;
        status?: string | WATCHING_STATUS;
        sort?: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeList<Anime> | null>;
    /**
     * Update user's anime list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for list updating.
     * @param {string} [options.id] - The ID of the anime entry you want to update. This is **required**.
     * @param {number} [options.status="watching"] - The status to update the entry to. You can use the enum `WATCHING_STATUS_UPDATE` instead of a string. It is automatically imported. Defaults to `"watching"`. Can be either `"watching"`, `"completed"`, `"on_hold"`, `"dropped"`, `"plan_to_watch"`.
     * @param {number} [options.score] - The score. Can be between `0` and `10`.
     * @param {boolean} [options.is_rewatching] - Whether the entry is a re-watch.
     * @param {number} [options.episodes] - The amount of episodes watched.
     * @param {number} [options.priority] - Priority of the entry. Can be between `0` and `2`.
     * @param {number} [options.times_rewatched] - The amount of times anime has been rewatched.
     * @param {number} [options.rewatch_value] - The rewatch value. Can be between `0` and `5`.
     * @param {string} [options.tags] - Optional tags you can add.
     * @param {string} [options.comments] - Optional comments on the entry.
     *
     * @returns {Promise<AnimeEntry | null>} - Returns a promise that resolves to an `AnimeEntry` object, or `null` if MAL API is having issues.
     */
    update({ id, status, score, is_rewatching, episodes, priority, times_rewatched, rewatch_value, tags, comments }: {
        id: number | string;
        status?: string | WATCHING_STATUS_UPDATE;
        score: number;
        is_rewatching?: boolean;
        episodes?: number;
        priority?: number;
        times_rewatched?: number;
        rewatch_value?: number;
        tags?: string;
        comments?: string;
    }): Promise<AnimeEntry | null>;
    /**
     * Delete an entry from a user's anime list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for entry deletion.
     * @param {string | number} [options.id] - The ID of the anime entry you want to delete. This is **required**.
     *
     * @returns {Promise<true | false>} - Returns a promise that resolves to either `true` or `false` -> `true` if successful, `false` if failed. Usually `false` would be returned if the specific anime is not on the user's list.
     */
    delete({ id }: {
        id: number | string;
    }): Promise<true | false>;
}
declare class UserMangaListAPI {
    private client;
    private main;
    constructor(client: MALClient, main: UserAPI);
    mapSearchResults(raw: any): Promise<MangaList<Manga>>;
    next(url: string, query: string): Promise<MangaList<Manga>>;
    prev(url: string, query: string): Promise<MangaList<Manga>>;
    /**
     * Get user's manga list.
     * Please note: you may access public lists without the need for the user to be authenticated by passing the `username` argument.
     * But, `my_list_status` will be `undefined` if not authenticated. This is MAL limitations.
     *
     * @param {Object} options - The options for the query.
     * @param {string} [options.username="@me"] - The username of the person you want to fetch the list from. This endpoint does not require authentication so you can pass any username. But if you are authenticated, then you can pass `"@me"` for the authenticated user list. Note that if a user's manga list is set to private, you may not access it without authentication. Defaults to `"@me"`.
     * @param {string} [options.status="all"] - The status to fetch the list from. You can use the enum `READING_STATUS` instead of a string. It is automatically imported. Defaults to `"all"`. Can be either `"all"`, `"reading"`, `"completed"`, `"on_hold"`, `"dropped"`, `"plan_to_read"`.
     * @param {string} [options.sort="default"] - The way results should be sorted. Defaults to `"default"`. Can be either `"list_score"` (Desc), `"list_updated_at"` (Desc), `"manga_title"` (Asc), `"manga_start_date"` (Desc).
     * @param {number} [options.limit=100] - The number of items. Can be between `1` and `1000`. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof MANGA_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the manga details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the manga. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<MangaList<Manga> | null>} - Returns a promise that resolves to an `MangaList` object, or `null` if MAL API is having issues.
     */
    get({ username, status, sort, limit, offset, fieldPreset, extraFields, }?: {
        username?: string;
        status?: string | READING_STATUS;
        sort?: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<MangaList<Manga> | null>;
    /**
     * Update user's manga list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for list updating.
     * @param {string | number} [options.id] - The ID of the manga entry you want to update. This is **required**.
     * @param {number} [options.status="reading"] - The status to update the entry to. You can use the enum `READING_STATUS_UPDATE` instead of a string. It is automatically imported. Defaults to `"reading"`. Can be either `"reading"`, `"completed"`, `"on_hold"`, `"dropped"`, `"plan_to_read"`.
     * @param {number} [options.score] - The score. Can be between `0` and `10`.
     * @param {boolean} [options.is_rereading] - Whether the entry is a re-read.
     * @param {number} [options.volumes] - The amount of volumes read.
     * @param {number} [options.chapters] - The amount of chapters read.
     * @param {number} [options.priority] - Priority of the entry. Can be between `0` and `2`.
     * @param {number} [options.times_reread] - The amount of times manga has been re-read.
     * @param {number} [options.reread_value] - The re-read value. Can be between `0` and `5`.
     * @param {string} [options.tags] - Optional tags you can add.
     * @param {string} [options.comments] - Optional comments on the entry.
     *
     * @returns {Promise<MangaList | null>} - Returns a promise that resolves to an `MangaList` object, or `null` if MAL API is having issues.
     */
    update({ id, status, score, is_rereading, chapters, volumes, priority, times_reread, rewatch_value, tags, comments }: {
        id: number | string;
        status?: string | READING_STATUS_UPDATE;
        score: number;
        is_rereading?: boolean;
        chapters?: number;
        volumes?: number;
        priority?: number;
        times_reread?: number;
        rewatch_value?: number;
        tags?: string;
        comments?: string;
    }): Promise<MangaEntry | null>;
    /**
     * Delete an entry from a user's manga list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for entry deletion.
     * @param {string | number} [options.id] - The ID of the manga entry you want to delete. This is **required**.
     *
     * @returns {Promise<true | false>} - Returns a promise that resolves to either `true` or `false` -> `true` if successful, `false` if failed. Usually `false` would be returned if the specific manga is not on the user's list.
     */
    delete({ id }: {
        id: number | string;
    }): Promise<true | false>;
}
export {};
