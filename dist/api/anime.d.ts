import { MALClient } from "./client.js";
import { ANIME_FIELDS, RANKING_ANIME } from "../utils/constants.js";
import { Anime, AnimeSearchResult } from "../models/anime.js";
export declare class AnimeAPI {
    private client;
    constructor(client: MALClient);
    /**
     * Fetches the anime details based on the given `id`.
     * @param {Object} options - Fetch options.
     * @param {number | string} options.id - The unique identifier of the anime (either number or string).
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for fetching anime details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`.
     *   Can be either "basic", "medium" or "full" or an array of custom fields to retrieve.
     *   Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime.
     *   Defaults to an empty array (`[]`).
     * @returns {Promise<Anime | null>} - Returns a promise that resolves to an `Anime` object, or `null` if no anime is found.
     */
    get({ id, fieldPreset, extraFields, }: {
        id: number | string;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<Anime | null>;
    private mapSearchResults;
    next(url: string, query: string): Promise<AnimeSearchResult<Anime>>;
    prev(url: string, query: string): Promise<AnimeSearchResult<Anime>>;
    /**
     * Search for animes with `query`.
     * @param {Object} options - Search options.
     * @param {string} [options.query] - The search query.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 100. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. You can just pass a 0, as this wrapper handles pagination for you.
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for fetching anime details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`.
     *   Can be either "basic", "medium" or "full" or an array of custom fields to retrieve.
     *   Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime.
     *   Defaults to an empty array (`[]`).
     * @returns {Promise<AnimeSearchResult<Anime> | null>} - Returns a promise that resolves to an `AnimeSearchResult` object, or `null` if no anime is found.
     */
    search({ query, limit, offset, fieldPreset, extraFields, }: {
        query: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeSearchResult<Anime> | null>;
    /**
     * Get top ranking anime.
     *
     * @param {Object} options - The options for the top ranking query.
     * @param {string} [options.ranking_type="all"] - The ranking type. You can use the enum `RANKING_ANIME` instead of a string. It is automatically imported with `MAL`. Can be either `"all"`, `"airing"`, `"upcoming"`, `"tv"`, `"ova"`, `"movie"`, `"special"`, `"bypopularity"`, or `"favorite"`. Defaults to `"all"`.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 500. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the anime details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<AnimeSearchResult | null>} - Returns a promise that resolves to an `AnimeSearchResult` object, or `null` if MAL API is having issues.
     */
    top({ ranking_type, limit, offset, fieldPreset, extraFields, }?: {
        ranking_type?: string | RANKING_ANIME;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeSearchResult<Anime> | null>;
    /**
     * Get seasonal anime.
     *
     * @param {Object} options - The options for the seasonal anime.
     * @param {string} [options.season="current"] - The season. Should be in format `"FALL 2020"`. Valid seasons are `FALL`, `WINTER`, `SPRING`, `SUMMER`. You can also just pass `"current"` for the current season. Defaults to `"current"`.
     * @param {string} [options.sort="default"] - The sorting type. Available values are `"default"`, `"score"`, `"amount_users"`. Defaults to `"default"`. Please note that sorting is in descending order and cannot be changed due to MAL limitations.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 500. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof ANIME_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the anime details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the anime. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<AnimeSearchResult | null>} - Returns a promise that resolves to an `AnimeSearchResult` object, or `null` if MAL API is having issues.
     */
    season({ season, sort, limit, offset, fieldPreset, extraFields, }?: {
        season?: string;
        sort?: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeSearchResult<Anime> | null>;
}
