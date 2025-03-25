import { MALClient } from "@api/client";
import { BASE_URL, ANIME_FIELDS, RANKING_ANIME } from "@utils/constants";
import { Anime, RawAnime, AnimeRawSearchResults, AnimeSearchResult } from "@models/anime";

export class AnimeAPI {
    private client: MALClient;

    constructor(client: MALClient) {
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
    async get({
        id,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        id: number | string;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<Anime | null> {
        if (!id) {
            throw new Error("ID is a required argument that is missing.")
        }

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
        }

        const api_url = `${BASE_URL}/anime/${id}?fields=${fields.join(",")}`;
        const data = await this.client.fetchData<RawAnime>(api_url, "anime", id);

        if (!data) return null;

        // Map data to the Anime interface
        const mappedData: Anime = {
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
            pictures: data.pictures?.map((pic: { medium: string, large: string }) => ({
                medium: pic.medium,
                large: pic.large,
            })) || undefined,
            background: data.background || undefined,
            related_anime: data.related_anime?.map((relation: any) => ({
                anime: relation.node, // Remap node to anime
                relation_type: relation.relation_type,
                relation_type_formatted: relation.relation_type_formatted
            })) || undefined,
            related_manga: data.related_manga?.map((relation: any) => ({
                manga: relation.node, // Remap node to manga
                relation_type: relation.relation_type,
                relation_type_formatted: relation.relation_type_formatted
            })) || undefined,
            recommendations: data.recommendations?.map((relation: any) => ({
                anime: relation.node, // Remap node to anime
                num_recommendations: relation.num_recommendations,
            })) || undefined,
            statistics: data.statistics ? {
                status_groups: {
                    watching: Number(data.statistics.status.watching ?? 0),
                    completed: Number(data.statistics.status.completed ?? 0),
                    on_hold: Number(data.statistics.status.on_hold ?? 0),
                    dropped: Number(data.statistics.status.dropped ?? 0),
                    plan_to_watch: Number(data.statistics.status.plan_to_watch ?? 0),
                },
                user_amount: Number(data.statistics.num_list_users ?? 0),
            } : undefined,
        };

        return mappedData;
    }


    // This function maps the search results to AnimeSearchResult interface.
    private async mapSearchResults(raw: any) {

        // Map data to the Anime interface
        const mappedData: AnimeSearchResult<Anime> = {
            // @ts-ignore
            results: raw.data.map(({ node }) => ({
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
                    pictures: node.pictures?.map((pic: { medium: string, large: string }) => ({
                        medium: pic.medium,
                        large: pic.large,
                    })) || undefined,
                    background: node.background || undefined,
                    related_anime: node.related_anime?.map((relation: any) => ({
                        anime: relation.node, // Remap node to anime
                        relation_type: relation.relation_type,
                        relation_type_formatted: relation.relation_type_formatted
                    })) || undefined,
                    related_manga: node.related_manga?.map((relation: any) => ({
                        manga: relation.node, // Remap node to manga
                        relation_type: relation.relation_type,
                        relation_type_formatted: relation.relation_type_formatted
                    })) || undefined,
                    recommendations: node.recommendations?.map((relation: any) => ({
                        anime: relation.node, // Remap node to anime
                        num_recommendations: relation.num_recommendations,
                    })) || undefined,
                    statistics: node.statistics ? {
                        status_groups: {
                            watching: Number(node.statistics.status.watching ?? 0),
                            completed: Number(node.statistics.status.completed ?? 0),
                            on_hold: Number(node.statistics.status.on_hold ?? 0),
                            dropped: Number(node.statistics.status.dropped ?? 0),
                            plan_to_watch: Number(node.statistics.status.plan_to_watch ?? 0),
                        },
                        user_amount: Number(node.statistics.num_list_users ?? 0),
                    } : undefined,
                }
            })),
            hasNext: undefined,
            hasPrev: undefined,
            next: undefined,
            prev: undefined,
        };

        // Ensure we return a resolved promise with only the necessary fields
        return Promise.resolve(mappedData);
    }



    // These functions will act as pagination for the search results.
    async next(url: string, query: string) {
        const raw = await this.client.fetchData<AnimeRawSearchResults>(url, "anime", query);

        const mappedData = await this.mapSearchResults(raw);

        mappedData.hasNext = !!raw?.paging?.next;
        mappedData.hasPrev = !!raw?.paging?.previous;
        mappedData.next = raw?.paging?.next
            ? () => this.next(raw.paging?.next!, query)
            : undefined;
        mappedData.prev = raw?.paging?.previous
            ? () => this.prev(raw.paging?.previous!, query)
            : undefined;


        return mappedData;
    }

    async prev(url: string, query: string) {
        const raw = await this.client.fetchData<AnimeRawSearchResults>(url, "anime", query);

        const mappedData = await this.mapSearchResults(raw);

        mappedData.hasNext = !!raw?.paging?.next;
        mappedData.hasPrev = !!raw?.paging?.previous;
        mappedData.next = raw?.paging?.next
            ? () => this.next(raw.paging?.next!, query)
            : undefined;
        mappedData.prev = raw?.paging?.previous
            ? () => this.prev(raw.paging?.previous!, query)
            : undefined;


        return mappedData;
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
    async search({
        query,
        limit = 100,
        offset = 0,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        query: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    }): Promise<AnimeSearchResult<Anime> | null> {
        if (query.length < 1) {
            throw new Error("Query is a required argument that must contain at least 1 character.");
        }

        if (limit > 100 || limit < 1) {
            throw new Error("Limit must be between 1 and 100. (Default: 100)");
        }

        if (offset < 0) {
            throw new Error("Offset cannot be less than 0.");
        }

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
        }

        let api_url = `${BASE_URL}/anime?q=${query}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
        const raw = await this.client.fetchData<AnimeRawSearchResults>(api_url, "anime", query);

        if (!raw) return null;

        const mappedData = await this.mapSearchResults(raw);
        mappedData.hasNext = !!raw.paging?.next;
        mappedData.hasPrev = !!raw.paging?.previous;
        mappedData.next = raw.paging?.next
            ? () => this.next(raw.paging?.next!, query)
            : undefined;
        mappedData.prev = raw.paging?.previous
            ? () => this.prev(raw.paging?.previous!, query)
            : undefined;


        return mappedData;
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
    async top({
        ranking_type = "all",
        limit = 100,
        offset = 0,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        ranking_type?: string | RANKING_ANIME;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    } = {}): Promise<AnimeSearchResult<Anime> | null> {
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

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
        }

        let api_url = `${BASE_URL}/anime/ranking?ranking_type=${ranking_type}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
        const raw = await this.client.fetchData<AnimeRawSearchResults>(api_url, "anime", ranking_type);

        if (!raw) return null;

        const mappedData = await this.mapSearchResults(raw);
        mappedData.hasNext = !!raw.paging?.next;
        mappedData.hasPrev = !!raw.paging?.previous;
        mappedData.next = raw.paging?.next
            ? () => this.next(raw.paging?.next!, ranking_type)
            : undefined;
        mappedData.prev = raw.paging?.previous
            ? () => this.prev(raw.paging?.previous!, ranking_type)
            : undefined;


        return mappedData;
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
    async season({
        season = "current",
        sort = "default",
        limit = 100,
        offset = 0,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        season?: string;
        sort?: string;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof ANIME_FIELDS | string[];
        extraFields?: string[];
    } = {}): Promise<AnimeSearchResult<Anime> | null> {
        if (limit > 500 || limit < 1) {
            throw new Error("Limit must be between 1 and 500. (Default: 100)");
        }

        if (offset < 0) {
            throw new Error("Offset cannot be less than 0.");
        }

        let sort_type: string | null = null;
        sort = sort.toLowerCase();

        if (sort === "score") {
            sort_type = "anime_score";
        } else if (sort === "amount_users") {
            sort_type = "anime_num_list_users";
        } else if (sort !== "default") {
            throw new Error("Invalid sorting method. Refer to documentation.");
        }

        let season_split: string[] | null = null;
        let season_year: string | null = null;
        let season_period: string | null = null;

        const seasons = ["fall", "summer", "spring", "winter"];

        if (season !== "current") {
            season_split = season.toLowerCase().split(" ");

            if (!seasons.includes(season_split[0]) && !seasons.includes(season_split[1])) {
                throw new Error(`The season you passed is invalid. Should be either ${seasons.join(", ")}.`);
            }

            if (
                (!Number.isInteger(Number(season_split[1])) ||
                    Number(season_split[1]) < 1970)
                &&
                (!Number.isInteger(Number(season_split[0])) ||
                    Number(season_split[0]) < 1970)
            ) {
                throw new Error("Invalid year. Must be at least 1970.");
            }

            if (seasons.includes(season_split[0])) {
                season_period = season_split[0];
                season_year = season_split[1];
            } else {
                season_period = season_split[1];
                season_year = season_split[0];
            }
        } else {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            season_period = seasons[Math.floor((currentMonth - 1) / 3)];

            season_year = currentYear.toString();
        }

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...ANIME_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(ANIME_FIELDS[fieldPreset] || ANIME_FIELDS["medium"]), ...extraFields];
        }

        let _limit: string = limit.toString();
        let _offset: string = offset.toString();

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

        const raw = await this.client.fetchData<AnimeRawSearchResults>(api_url, "anime", season);

        if (!raw) return null;

        const mappedData = await this.mapSearchResults(raw);
        mappedData.hasNext = !!raw.paging?.next;
        mappedData.hasPrev = !!raw.paging?.previous;
        mappedData.next = raw.paging?.next
            ? () => this.next(raw.paging?.next!, season)
            : undefined;
        mappedData.prev = raw.paging?.previous
            ? () => this.prev(raw.paging?.previous!, season)
            : undefined;


        return mappedData;
    }
}

