import { MALClient } from "./client.js";
import { MANGA_FIELDS, RANKING_MANGA } from "../utils/constants.js";
import { Manga, MangaSearchResult } from "../models/manga.js";
export declare class MangaAPI {
    private client;
    constructor(client: MALClient);
    /**
     * Fetches the manga details based on the given `id`.
     * @param {Object} options - Fetch options.
     * @param {number | string} options.id - The unique identifier of the manga (either number or string).
     * @param {keyof typeof MANGA_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for fetching manga details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`.
     *   Can be either "basic", "medium" or "full" or an array of custom fields to retrieve.
     *   Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the manga.
     *   Defaults to an empty array (`[]`).
     * @returns {Promise<Manga | null>} - Returns a promise that resolves to an `Manga` object, or `null` if no manga is found.
     */
    get({ id, fieldPreset, extraFields, }: {
        id: number | string;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<Manga | null>;
    private mapSearchResults;
    next(url: string, query: string): Promise<MangaSearchResult<Manga>>;
    prev(url: string, query: string): Promise<MangaSearchResult<Manga>>;
    /**
     * Search for manga with `query`.
     * @param {Object} options - Search options.
     * @param {string} [options.query] - The search query.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 100. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. You can just pass a 0, as this wrapper handles pagination for you.
     * @param {keyof typeof MANGA_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for fetching manga details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`.
     *   Can be either "basic", "medium" or "full" or an array of custom fields to retrieve.
     *   Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the manga.
     *   Defaults to an empty array (`[]`).
     * @returns {Promise<MangaSearchResult<Manga> | null>} - Returns a promise that resolves to an `MangaSearchResult` object, or `null` if no manga is found.
     */
    search({ query, limit, offset, fieldPreset, extraFields, }: {
        query: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<MangaSearchResult<Manga> | null>;
    /**
     * Get top ranking manga.
     *
     * @param {Object} options - The options for the top ranking query.
     * @param {string} [options.ranking_type="all"] - The ranking type. You can use the enum `RANKING_MANGA` instead of a string. It is automatically imported. Can be either `"all"`, `"manga"`, `"novels"`, `"oneshots"`, `"doujin"`, `"manhwa"`, `"manhua"`, `"bypopularity"`, or `"favorite"`. Defaults to `"all"`.
     * @param {number} [options.limit=100] - The amount of results. Can be between 1 and 500. Defaults to `100`.
     * @param {number} [options.offset=0] - Number to offset results. Defaults to `0`. You can just pass `0`, as this wrapper handles pagination for you.
     * @param {keyof typeof MANGA_FIELDS | string[]} [options.fieldPreset="medium"] - The field preset to use for the manga details. You can use the enum `FIELD_PRESET` instead of strings. It is automatically imported with `MAL`. Can be `"basic"`, `"medium"`, `"full"`, or an array of custom fields to retrieve. Defaults to `"medium"`.
     * @param {string[]} [options.extraFields=[]] - Additional custom fields to fetch for the manga. Defaults to an empty array (`[]`).
     *
     * @returns {Promise<AnimeSearchResult | null>} - Returns a promise that resolves to an `MangaSearchResult` object, or `null` if MAL API is having issues.
     */
    top({ ranking_type, limit, offset, fieldPreset, extraFields, }?: {
        ranking_type?: string | RANKING_MANGA;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<MangaSearchResult<Manga> | null>;
}
