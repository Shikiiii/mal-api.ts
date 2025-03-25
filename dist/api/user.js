var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BASE_URL, ANIME_FIELDS, MANGA_FIELDS, USER_FIELDS } from "../utils/constants.js";
export class UserAPI {
    constructor(client) {
        this.client = client;
        this.main = this;
        this.animelist = new UserAnimeListAPI(client, this.main);
        this.mangalist = new UserMangaListAPI(client, this.main);
    }
    /**
     * Authenticate a user using an access token.
     * You only need to call this once.
     *
     * @param {string} accessToken - Access token.
     * @param {string} refreshToken - Refresh token.
     */
    auth(accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (accessToken, refreshToken = undefined) {
            this.client.accessToken = accessToken;
            this.client.refreshToken = refreshToken;
        });
    }
    /**
     * Get user's information.
     * Please note that you must have ran `auth()` before this.
     * It is not possible to fetch the information for a user if not authenticated. This is MAL limitations.
     *
     * @returns {Promise<User | null>} - Returns a promise that resolves to an `User` object, or `null` if MAL API is having issues.
     */
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            let fields = USER_FIELDS["full"];
            let api_url = `${BASE_URL}/users/@me?fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "user", "user info");
            if (!raw)
                return null;
            const mappedData = {
                id: raw.id,
                name: raw.name,
                picture: raw.picture || undefined,
                gender: raw.gender || undefined,
                birthday: raw.birthday || undefined,
                location: raw.location || undefined,
                joined_at: raw.joined_at || undefined,
                anime_statistics: {
                    watching: raw.anime_statistics.num_items_watching || undefined,
                    completed: raw.anime_statistics.num_items_completed || undefined,
                    on_hold: raw.anime_statistics.num_items_on_hold || undefined,
                    dropped: raw.anime_statistics.num_items_dropped || undefined,
                    plan_to_watch: raw.anime_statistics.num_items_plan_to_watch || undefined,
                    total: raw.anime_statistics.num_items || undefined,
                    days_watched: raw.anime_statistics.num_days_watched || undefined,
                    days_watching: raw.anime_statistics.num_days_watching || undefined,
                    days_completed: raw.anime_statistics.num_days_completed || undefined,
                    days_on_hold: raw.anime_statistics.num_days_on_hold || undefined,
                    days_dropped: raw.anime_statistics.num_days_dropped || undefined,
                    total_days: raw.anime_statistics.num_days || undefined,
                    episodes: raw.anime_statistics.num_episodes || undefined,
                    rewatched: raw.anime_statistics.num_times_rewatched || undefined,
                    mean_score: raw.anime_statistics.mean_score || undefined,
                },
                time_zone: raw.time_zone || undefined,
                is_supporter: raw.is_supporter || undefined,
            };
            return mappedData;
        });
    }
    // This function maps the search results to AnimeList interface.
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
                            num_episodes: node.num_episodes || undefined,
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
                            my_list_status: node.my_list_status || undefined,
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
    suggested() {
        return __awaiter(this, arguments, void 0, function* ({ limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
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
            let api_url = `${BASE_URL}/anime/suggestions?limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            const raw = yield this.client.fetchData(api_url, "anime", "user suggestions");
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, "user suggestions"); }
                : undefined;
            mappedData.prev = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, "user suggestions"); }
                : undefined;
            return mappedData;
        });
    }
}
class UserAnimeListAPI {
    constructor(client, main) {
        this.client = client;
        this.main = main;
    }
    // This function maps the search results to AnimeList interface.
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
                            num_episodes: node.num_episodes || undefined,
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
                            my_list_status: node.my_list_status || undefined,
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
    get() {
        return __awaiter(this, arguments, void 0, function* ({ username = "@me", status = "all", sort = "default", limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
            if (limit > 1000 || limit < 1) {
                throw new Error("Limit must be between 1 and 100. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            const validStatuses = ["all", "watching", "completed", "dropped", "plan_to_watch", "on_hold"];
            if (!validStatuses.includes(status.toLowerCase())) {
                throw new Error(`The status you passed (${status}) is not a valid status. Should be either ${validStatuses.join(", ")}.`);
            }
            const validSorts = ["default", "list_score", "list_updated_at", "anime_title", "anime_start_date"];
            if (!validSorts.includes(sort.toLowerCase())) {
                throw new Error(`The status you passed (${status}) is not a valid status. Should be either ${validSorts.join(", ")}`);
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
            let api_url = `${BASE_URL}/users/${username}/animelist?limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            if (status.toLowerCase() !== "all") {
                api_url += `&status=${status.toLowerCase()}`;
            }
            if (sort.toLowerCase() !== "default") {
                api_url += `&sort=${sort.toLowerCase()}`;
            }
            const raw = yield this.client.fetchData(api_url, "anime", "user animelist");
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.main.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, "user animelist"); }
                : undefined;
            mappedData.prev = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.main.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, "user animelist"); }
                : undefined;
            return mappedData;
        });
    }
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
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, status = "watching", score, is_rewatching, episodes, priority, times_rewatched, rewatch_value, tags, comments }) {
            const api_url = `${BASE_URL}/anime/${id}/my_list_status`;
            const params = new URLSearchParams();
            // Valid statuses
            const validStatuses = ["watching", "completed", "dropped", "plan_to_watch", "on_hold"];
            if (!validStatuses.includes(status.toLowerCase())) {
                throw new Error(`Invalid status: "${status}". Must be one of: ${validStatuses.join(", ")}.`);
            }
            // Append required status param
            params.append("status", status.toLowerCase());
            // Helper function to validate and append params
            const appendParam = (key, value, condition, errorMsg) => {
                if (value !== undefined) {
                    if (condition && !condition(value)) {
                        throw new Error(errorMsg || `Invalid value for ${key}`);
                    }
                    params.append(key, value.toString());
                }
            };
            // Append optional parameters with validation
            appendParam("score", score, (v) => v >= 0 && v <= 10, "Score must be between 0 and 10.");
            appendParam("is_rewatching", is_rewatching);
            appendParam("num_watched_episodes", episodes, (v) => v >= 0, "Episodes must be greater than or equal to 0.");
            appendParam("priority", priority, (v) => v >= 0 && v <= 2, "Priority must be between 0 and 2.");
            appendParam("num_times_rewatched", times_rewatched, (v) => v >= 0, "Times rewatched must be 0 or more.");
            appendParam("rewatch_value", rewatch_value, (v) => v >= 0 && v <= 5, "Rewatch value must be between 0 and 5.");
            appendParam("tags", tags);
            appendParam("comments", comments);
            const raw = yield this.client.updateList(api_url, "anime", id, params);
            if (!raw)
                return null;
            const mappedData = {
                status: raw.status,
                score: raw.score,
                episodes: raw.num_episodes_watched,
                is_rewatching: raw.is_rewatching,
                updated_at: raw.updated_at,
                priority: raw.priority,
                times_rewatched: raw.num_times_rewatched,
                rewatch_value: raw.rewatch_value,
                tags: raw.tags,
                comments: raw.comments
            };
            return mappedData;
        });
    }
    /**
     * Delete an entry from a user's anime list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for entry deletion.
     * @param {string | number} [options.id] - The ID of the anime entry you want to delete. This is **required**.
     *
     * @returns {Promise<true | false>} - Returns a promise that resolves to either `true` or `false` -> `true` if successful, `false` if failed. Usually `false` would be returned if the specific anime is not on the user's list.
     */
    delete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const api_url = `${BASE_URL}/anime/${id}/my_list_status`;
            return yield this.client.deleteEntry(api_url, "anime", id);
        });
    }
}
class UserMangaListAPI {
    constructor(client, main) {
        this.client = client;
        this.main = main;
    }
    // This function maps the search results to MangaList interface.
    mapSearchResults(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            // Map data to the Anime interface
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
    get() {
        return __awaiter(this, arguments, void 0, function* ({ username = "@me", status = "all", sort = "default", limit = 100, offset = 0, fieldPreset = "medium", extraFields = [], } = {}) {
            var _a, _b, _c, _d;
            if (limit > 1000 || limit < 1) {
                throw new Error("Limit must be between 1 and 100. (Default: 100)");
            }
            if (offset < 0) {
                throw new Error("Offset cannot be less than 0.");
            }
            const validStatuses = ["all", "reading", "completed", "dropped", "plan_to_read", "on_hold"];
            if (!validStatuses.includes(status.toLowerCase())) {
                throw new Error(`The status you passed (${status}) is not a valid status. Should be either ${validStatuses.join(", ")}.`);
            }
            const validSorts = ["default", "list_score", "list_updated_at", "manga_title", "manga_start_date"];
            if (!validSorts.includes(sort.toLowerCase())) {
                throw new Error(`The status you passed (${status}) is not a valid status. Should be either ${validSorts.join(", ")}`);
            }
            let fields;
            // Check if fieldPreset is an array or a preset string
            if (Array.isArray(fieldPreset)) {
                fields = [...MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
            }
            else {
                // Use preset + optional extra fields, default to "medium" if preset is not valid
                fields = [...(MANGA_FIELDS[fieldPreset] || MANGA_FIELDS["medium"]), ...extraFields];
            }
            let api_url = `${BASE_URL}/users/${username}/mangalist?limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
            if (status.toLowerCase() !== "all") {
                api_url += `&status=${status.toLowerCase()}`;
            }
            if (sort.toLowerCase() !== "default") {
                api_url += `&sort=${sort.toLowerCase()}`;
            }
            const raw = yield this.client.fetchData(api_url, "manga", "user mangalist");
            if (!raw)
                return null;
            const mappedData = yield this.mapSearchResults(raw);
            mappedData.hasNext = !!((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next);
            mappedData.hasPrev = !!((_b = raw.paging) === null || _b === void 0 ? void 0 : _b.previous);
            mappedData.next = ((_c = raw.paging) === null || _c === void 0 ? void 0 : _c.next)
                ? () => { var _a; return this.next((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.next, "user mangalist"); }
                : undefined;
            mappedData.prev = ((_d = raw.paging) === null || _d === void 0 ? void 0 : _d.previous)
                ? () => { var _a; return this.prev((_a = raw.paging) === null || _a === void 0 ? void 0 : _a.previous, "user mangalist"); }
                : undefined;
            return mappedData;
        });
    }
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
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, status = "reading", score, is_rereading, chapters, volumes, priority, times_reread, rewatch_value, tags, comments }) {
            const api_url = `${BASE_URL}/manga/${id}/my_list_status`;
            const params = new URLSearchParams();
            // Valid statuses
            const validStatuses = ["reading", "completed", "dropped", "plan_to_read", "on_hold"];
            if (!validStatuses.includes(status.toLowerCase())) {
                throw new Error(`Invalid status: "${status}". Must be one of: ${validStatuses.join(", ")}.`);
            }
            // Append required status param
            params.append("status", status.toLowerCase());
            // Helper function to validate and append params
            const appendParam = (key, value, condition, errorMsg) => {
                if (value !== undefined) {
                    if (condition && !condition(value)) {
                        throw new Error(errorMsg || `Invalid value for ${key}`);
                    }
                    params.append(key, value.toString());
                }
            };
            // Append optional parameters with validation
            appendParam("score", score, (v) => v >= 0 && v <= 10, "Score must be between 0 and 10.");
            appendParam("is_rereading", is_rereading);
            appendParam("num_volumes_read", volumes, (v) => v >= 0, "Volumes must be greater than or equal to 0.");
            appendParam("num_chapters_read", chapters, (v) => v >= 0, "Chapters must be greater than or equal to 0.");
            appendParam("priority", priority, (v) => v >= 0 && v <= 2, "Priority must be between 0 and 2.");
            appendParam("num_times_reread", times_reread, (v) => v >= 0, "Times reread must be 0 or more.");
            appendParam("rewatch_value", rewatch_value, (v) => v >= 0 && v <= 5, "Reread value must be between 0 and 5.");
            appendParam("tags", tags);
            appendParam("comments", comments);
            const raw = yield this.client.updateList(api_url, "manga", id, params);
            if (!raw)
                return null;
            const mappedData = {
                status: raw.status,
                score: raw.score,
                volumes: raw.num_volumes_read,
                chapters: raw.num_chapters_read,
                is_rereading: raw.is_rereading,
                updated_at: raw.updated_at,
                priority: raw.priority,
                times_reread: raw.num_times_reread,
                reread_value: raw.reread_value,
                tags: raw.tags,
                comments: raw.comments
            };
            return mappedData;
        });
    }
    /**
     * Delete an entry from a user's manga list.
     * You need to be authenticated via `auth()` before using this function. Otherwise an `AuthFailed` error will be raised.
     *
     * @param {Object} options - The options for entry deletion.
     * @param {string | number} [options.id] - The ID of the manga entry you want to delete. This is **required**.
     *
     * @returns {Promise<true | false>} - Returns a promise that resolves to either `true` or `false` -> `true` if successful, `false` if failed. Usually `false` would be returned if the specific manga is not on the user's list.
     */
    delete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const api_url = `${BASE_URL}/manga/${id}/my_list_status`;
            return yield this.client.deleteEntry(api_url, "manga", id);
        });
    }
}
//# sourceMappingURL=user.js.map