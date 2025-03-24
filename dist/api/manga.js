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
exports.MangaAPI = void 0;
const constants_1 = require("../utils/constants");
class MangaAPI {
    constructor(client) {
        this.client = client;
    }
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
    get(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, fieldPreset = "medium", extraFields = [], }) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (!id) {
                throw new Error("ID is a required argument that is missing.");
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...constants_1.MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(constants_1.MANGA_FIELDS[fieldPreset] || constants_1.MANGA_FIELDS["medium"]), ...extraFields];
            }
            const api_url = `${constants_1.BASE_URL}/manga/${id}?fields=${fields.join(",")}`;
            const data = yield this.client.fetchData(api_url, "manga", id);
            if (!data)
                return null;
            // Map data to the Manga interface
            const mappedData = {
                id: data.id,
                title: data.title,
                banner: data.main_picture
                    ? {
                        medium: data.main_picture.medium ? { url: data.main_picture.medium } : undefined,
                        large: data.main_picture.large ? { url: data.main_picture.large } : undefined
                    }
                    : undefined // ✅ Ensure banner is explicitly `undefined` if no image exists
                ,
                alternative_titles: data.alternative_titles || undefined, // Only include if exists
                synopsis: data.synopsis || undefined,
                mean: data.mean || undefined,
                rank: data.rank || undefined,
                popularity: data.popularity || undefined,
                volumes: data.num_volumes || undefined,
                chapters: data.num_chapters || undefined,
                status: data.status || undefined,
                start_date: data.start_date || undefined,
                end_date: data.end_date || undefined,
                genres: data.genres || undefined,
                nsfw: data.nsfw === "white" ? false : true, // Map correctly
                user_amount: data.num_list_users || undefined,
                user_scored_amount: data.num_scoring_users || undefined,
                created_at: data.created_at || undefined,
                updated_at: data.updated_at || undefined,
                type: data.media_type || undefined,
                my_list_status: data.my_list_status
                    ? {
                        status: data.my_list_status.status,
                        score: data.my_list_status.score,
                        chapters_read: data.my_list_status.num_chapters_read,
                        volumes_read: data.my_list_status.num_volumes_read,
                        is_rereading: data.my_list_status.is_rereading,
                        updated_at: data.my_list_status.updated_at,
                    }
                    : undefined,
                pictures: ((_b = data.pictures) === null || _b === void 0 ? void 0 : _b.map((pic) => ({
                    medium: pic.medium,
                    large: pic.large,
                }))) || undefined,
                background: data.background || undefined,
                related_anime: ((_c = data.related_anime) === null || _c === void 0 ? void 0 : _c.map((relation) => ({
                    anime: relation.node, // Remap node to anime
                    relation_type: relation.relation_type,
                    relation_type_formatted: relation.relation_type_formatted
                }))) || undefined,
                related_manga: ((_d = data.related_manga) === null || _d === void 0 ? void 0 : _d.map((relation) => ({
                    manga: relation.node, // Remap node to manga
                    relation_type: relation.relation_type,
                    relation_type_formatted: relation.relation_type_formatted
                }))) || undefined,
                recommendations: ((_e = data.recommendations) === null || _e === void 0 ? void 0 : _e.map((relation) => ({
                    anime: relation.node, // Remap node to anime
                    num_recommendations: relation.num_recommendations,
                }))) || undefined,
                statistics: data.statistics ? {
                    status_groups: {
                        watching: Number((_f = data.statistics.status.watching) !== null && _f !== void 0 ? _f : 0),
                        completed: Number((_g = data.statistics.status.completed) !== null && _g !== void 0 ? _g : 0),
                        on_hold: Number((_h = data.statistics.status.on_hold) !== null && _h !== void 0 ? _h : 0),
                        dropped: Number((_j = data.statistics.status.dropped) !== null && _j !== void 0 ? _j : 0),
                        plan_to_watch: Number((_k = data.statistics.status.plan_to_watch) !== null && _k !== void 0 ? _k : 0),
                    },
                    user_amount: Number((_l = data.statistics.num_list_users) !== null && _l !== void 0 ? _l : 0),
                } : undefined,
                authors: (_m = data.authors) === null || _m === void 0 ? void 0 : _m.map((relation) => ({
                    author: relation.node,
                    role: relation.role,
                })),
                serialization: data.serialization || undefined,
            };
            return mappedData;
        });
    }
    // This function maps the search results to MangaSearchResult interface.
    mapSearchResults(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            // Map data to the Manga interface
            const mappedData = {
                // @ts-ignore
                results: raw.data.map(({ node }) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    return ({
                        manga: {
                            id: node.id,
                            title: node.title,
                            banner: node.main_picture
                                ? {
                                    medium: node.main_picture.medium ? { url: node.main_picture.medium } : undefined,
                                    large: node.main_picture.large ? { url: node.main_picture.large } : undefined
                                }
                                : undefined, // Ensure banner is explicitly `undefined` if no image exists
                            alternative_titles: node.alternative_titles || undefined,
                            synopsis: node.synopsis || undefined,
                            mean: node.mean || undefined,
                            rank: node.rank || undefined,
                            popularity: node.popularity || undefined,
                            volumes: node.num_volumes || undefined,
                            chapters: node.num_chapters || undefined,
                            status: node.status || undefined,
                            start_date: node.start_date || undefined,
                            end_date: node.end_date || undefined,
                            genres: node.genres || undefined,
                            nsfw: node.nsfw === "white" ? false : true, // Map correctly
                            user_amount: node.num_list_users || undefined,
                            user_scored_amount: node.num_scoring_users || undefined,
                            created_at: node.created_at || undefined,
                            updated_at: node.updated_at || undefined,
                            type: node.media_type || undefined,
                            my_list_status: node.my_list_status
                                ? {
                                    status: node.my_list_status.status,
                                    score: node.my_list_status.score,
                                    chapters_read: node.my_list_status.num_chapters_read,
                                    volumes_read: node.my_list_status.num_volumes_read,
                                    is_rereading: node.my_list_status.is_rereading,
                                    updated_at: node.my_list_status.updated_at,
                                }
                                : undefined,
                            pictures: ((_a = node.pictures) === null || _a === void 0 ? void 0 : _a.map((pic) => ({
                                medium: pic.medium,
                                large: pic.large,
                            }))) || undefined,
                            background: node.background || undefined,
                            related_anime: ((_b = node.related_anime) === null || _b === void 0 ? void 0 : _b.map((relation) => ({
                                anime: relation.node, // Remap node to anime
                                relation_type: relation.relation_type,
                                relation_type_formatted: relation.relation_type_formatted
                            }))) || undefined,
                            related_manga: ((_c = node.related_manga) === null || _c === void 0 ? void 0 : _c.map((relation) => ({
                                manga: relation.node, // Remap node to manga
                                relation_type: relation.relation_type,
                                relation_type_formatted: relation.relation_type_formatted
                            }))) || undefined,
                            recommendations: ((_d = node.recommendations) === null || _d === void 0 ? void 0 : _d.map((relation) => ({
                                anime: relation.node, // Remap node to anime
                                num_recommendations: relation.num_recommendations,
                            }))) || undefined,
                            statistics: node.statistics ? {
                                status_groups: {
                                    watching: Number((_e = node.statistics.status.watching) !== null && _e !== void 0 ? _e : 0),
                                    completed: Number((_f = node.statistics.status.completed) !== null && _f !== void 0 ? _f : 0),
                                    on_hold: Number((_g = node.statistics.status.on_hold) !== null && _g !== void 0 ? _g : 0),
                                    dropped: Number((_h = node.statistics.status.dropped) !== null && _h !== void 0 ? _h : 0),
                                    plan_to_watch: Number((_j = node.statistics.status.plan_to_watch) !== null && _j !== void 0 ? _j : 0),
                                },
                                user_amount: Number((_k = node.statistics.num_list_users) !== null && _k !== void 0 ? _k : 0),
                            } : undefined,
                            authors: (_l = node.authors) === null || _l === void 0 ? void 0 : _l.map((relation) => ({
                                author: relation.node,
                                role: relation.role,
                            })),
                            serialization: node.serialization || undefined,
                        }
                    });
                }),
                hasNext: undefined,
                hasPrev: undefined,
                next: undefined,
                prev: undefined,
            };
            // Ensure we return a resolved promise with only the necessary fields
            return Promise.resolve(mappedData);
        });
    }
    // These functions will act as pagination for the search results.
    next(url, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const raw = yield this.client.fetchData(url, "manga", query);
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, query); }
                : undefined;
            mappedData.prev = ((_d = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, query); }
                : undefined;
            return mappedData;
        });
    }
    prev(url, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const raw = yield this.client.fetchData(url, "manga", query);
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, query); }
                : undefined;
            mappedData.prev = ((_d = raw === null || raw === void 0 ? void 0 : raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, query); }
                : undefined;
            return mappedData;
        });
    }
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
    search(_a) {
        return __awaiter(this, arguments, void 0, function* ({ query, limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], }) {
            var _b, _c, _d, _e;
            if (query.length < 1) {
                throw new Error("Query is a required argument that must contain at least 1 character.");
            }
            if (limit > 100 || limit < 1) {
                throw new Error("Limit must be between 1 and 100. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...constants_1.MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(constants_1.MANGA_FIELDS[fieldPreset] || constants_1.MANGA_FIELDS["medium"]), ...extraFields];
            }
            let api_url = `${constants_1.BASE_URL}/manga?q=${query}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "manga", query);
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.next);
            mappedData.hasPrev = !!((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.previous);
            mappedData.next = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, query); }
                : undefined;
            mappedData.prev = ((_e = raw.paging) === null || _e === void 0 ? void 0 : _e.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, query); }
                : undefined;
            return mappedData;
        });
    }
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
    top() {
        return __awaiter(this, arguments, void 0, function* ({ ranking_type = "all", limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
            if (limit > 500 || limit < 1) {
                throw new Error("Limit must be between 1 and 500. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            const airingTypes = ["all", "manga", "novels", "oneshots", "doujin", "manhwa", "manhua", "bypopularity", "favorite"];
            if (!airingTypes.includes(ranking_type)) {
                throw new Error(`Invalid ranking type ${ranking_type}. Should be either ${airingTypes.join(", ")}.`);
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...constants_1.MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(constants_1.MANGA_FIELDS[fieldPreset] || constants_1.MANGA_FIELDS["medium"]), ...extraFields];
            }
            let api_url = `${constants_1.BASE_URL}/manga/ranking?ranking_type=${ranking_type}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "manga", ranking_type);
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, ranking_type); }
                : undefined;
            mappedData.prev = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, ranking_type); }
                : undefined;
            return mappedData;
        });
    }
}
exports.MangaAPI = MangaAPI;
//# sourceMappingURL=manga.js.map