var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BASE_URL, ANIME_FIELDS } from "../utils/constants.js";
export class AnimeAPI {
    constructor(client) {
        this.client = client;
    }
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
    get(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, fieldPreset = "medium", extraFields = [], }) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (!id) {
                throw new Error("ID is a required argument that is missing.");
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
            }
            const api_url = `${BASE_URL}/anime/${id}?fields=${fields.join(",")}`;
            const data = yield this.client.fetchData(api_url, "anime", id);
            if (!data)
                return null;
            // Map data to the Anime interface
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
                episodes: data.num_episodes || undefined,
                status: data.status || undefined,
                start_date: data.start_date || undefined,
                end_date: data.end_date || undefined,
                genres: data.genres || undefined,
                studios: data.studios || undefined,
                source: data.source || undefined,
                rating: data.rating || undefined,
                nsfw: data.nsfw === "white" ? false : true, // Map correctly
                broadcast: data.broadcast || undefined,
                user_amount: data.num_list_users || undefined,
                user_scored_amount: data.num_scoring_users || undefined,
                created_at: data.created_at || undefined,
                updated_at: data.updated_at || undefined,
                type: data.media_type || undefined,
                my_list_status: data.my_list_status
                    ? {
                        status: data.my_list_status.status,
                        score: data.my_list_status.score,
                        episodes_watched: data.my_list_status.num_episodes_watched,
                        is_rewatching: data.my_list_status.is_rewatching,
                        updated_at: data.my_list_status.updated_at,
                    }
                    : undefined,
                start_season: data.start_season || undefined,
                average_episode_duration: data.average_episode_duration || undefined,
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
            };
            return mappedData;
        });
    }
    // This function maps the search results to AnimeSearchResult interface.
    mapSearchResults(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            // Map data to the Anime interface
            const mappedData = {
                // @ts-ignore
                results: raw.data.map(({ node }) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return ({
                        anime: {
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
                            episodes: node.num_episodes || undefined,
                            status: node.status || undefined,
                            start_date: node.start_date || undefined,
                            end_date: node.end_date || undefined,
                            genres: node.genres || undefined,
                            studios: node.studios || undefined,
                            source: node.source || undefined,
                            rating: node.rating || undefined,
                            nsfw: node.nsfw === "white" ? false : true, // Map correctly
                            broadcast: node.broadcast || undefined,
                            user_amount: node.num_list_users || undefined,
                            user_scored_amount: node.num_scoring_users || undefined,
                            created_at: node.created_at || undefined,
                            updated_at: node.updated_at || undefined,
                            type: node.media_type || undefined,
                            my_list_status: node.my_list_status
                                ? {
                                    status: node.my_list_status.status,
                                    score: node.my_list_status.score,
                                    episodes_watched: node.my_list_status.num_episodes_watched,
                                    is_rewatching: node.my_list_status.is_rewatching,
                                    updated_at: node.my_list_status.updated_at,
                                }
                                : undefined,
                            start_season: node.start_season || undefined,
                            average_episode_duration: node.average_episode_duration || undefined,
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
            const raw = yield this.client.fetchData(url, "anime", query);
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
            const raw = yield this.client.fetchData(url, "anime", query);
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
                fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
            }
            let api_url = `${BASE_URL}/anime?q=${query}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "anime", query);
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
    top() {
        return __awaiter(this, arguments, void 0, function* ({ ranking_type = "all", limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
            if (limit > 500 || limit < 1) {
                throw new Error("Limit must be between 1 and 500. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            const airingFormats = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];
            if (!airingFormats.includes(ranking_type.toLowerCase())) {
                throw new Error(`The ranking type you passed (${ranking_type}) is invalid. Should be either ${airingFormats.join(", ")}`);
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
            }
            let api_url = `${BASE_URL}/anime/ranking?ranking_type=${ranking_type}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "anime", ranking_type);
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
    season() {
        return __awaiter(this, arguments, void 0, function* ({ season = "current", sort = "default", limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
            if (limit > 500 || limit < 1) {
                throw new Error("Limit must be between 1 and 500. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            let sort_type = null;
            sort = sort.toLowerCase();
            if (sort === "score") {
                sort_type = "anime_score";
            }
            else if (sort === "amount_users") {
                sort_type = "anime_num_list_users";
            }
            else if (sort !== "default") {
                throw new Error("Invalid sorting method. Refer to documentation.");
            }
            let season_split = null;
            let season_year = null;
            let season_period = null;
            const seasons = ["fall", "summer", "spring", "winter"];
            if (season !== "current") {
                season_split = season.toLowerCase().split(" ");
                if (!seasons.includes(season_split[0]) && !seasons.includes(season_split[1])) {
                    throw new Error(`The season you passed is invalid. Should be either ${seasons.join(", ")}.`);
                }
                if ((!Number.isInteger(Number(season_split[1])) ||
                    Number(season_split[1]) < 1970)
                    &&
                        (!Number.isInteger(Number(season_split[0])) ||
                            Number(season_split[0]) < 1970)) {
                    throw new Error("Invalid year. Must be at least 1970.");
                }
                if (seasons.includes(season_split[0])) {
                    season_period = season_split[0];
                    season_year = season_split[1];
                }
                else {
                    season_period = season_split[1];
                    season_year = season_split[0];
                }
            }
            else {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;
                season_period = seasons[Math.floor((currentMonth - 1) / 3)];
                season_year = currentYear.toString();
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
            }
            let _limit = limit.toString();
            let _offset = offset.toString();
            // Query params for the API url
            let queryParams = new URLSearchParams({
                limit: _limit,
                offset: _offset,
                fields: fields.join(","),
            });
            // Only append `sort` if `sort_type` is provided, but place it first because MAL doesn't like it being at the end.
            if (sort_type !== null) {
                let sortParams = new URLSearchParams();
                sortParams.append("sort", sort_type);
                // Add the sort param before the others
                queryParams = new URLSearchParams([...sortParams, ...queryParams]);
            }
            let api_url = `${BASE_URL}/anime/season/${season_year}/${season_period}?${queryParams.toString()}`;
            const raw = yield this.client.fetchData(api_url, "anime", season);
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, season); }
                : undefined;
            mappedData.prev = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, season); }
                : undefined;
            return mappedData;
        });
    }
}
//# sourceMappingURL=anime.js.map