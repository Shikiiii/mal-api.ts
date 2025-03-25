import { MALClient } from "@api/client";
import { BASE_URL, MANGA_FIELDS, RANKING_MANGA } from "@utils/constants";
import { Manga, RawManga, MangaRawSearchResults, MangaSearchResult } from "@models/manga";

export class MangaAPI {
    private client: MALClient;

    constructor(client: MALClient) {
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
    async get({
        id,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        id: number | string;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<Manga | null> {
        if (!id) {
            throw new Error("ID is a required argument that is missing.")
        }

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(MANGA_FIELDS[fieldPreset] || MANGA_FIELDS["medium"]), ...extraFields];
        }

        const api_url = `${BASE_URL}/manga/${id}?fields=${fields.join(",")}`;
        const data = await this.client.fetchData<RawManga>(api_url, "manga", id);

        if (!data) return null;

        // Map data to the Manga interface
        const mappedData: Manga = {
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
            authors: data.authors?.map((relation: any) => ({
                author: relation.node,
                role: relation.role,
            })),
            serialization: data.serialization || undefined,
        };

        return mappedData;
    }


    // This function maps the search results to MangaSearchResult interface.
    private async mapSearchResults(raw: any) {
        // Map data to the Manga interface
        const mappedData: MangaSearchResult<Manga> = {
            // @ts-ignore
            results: raw.data.map(({ node }) => ({
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
                    authors: node.authors?.map((relation: any) => ({
                        author: relation.node,
                        role: relation.role,
                    })),
                    serialization: node.serialization || undefined,
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
        const raw = await this.client.fetchData<MangaRawSearchResults>(url, "manga", query);

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
        const raw = await this.client.fetchData<MangaRawSearchResults>(url, "manga", query);

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
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    }): Promise<MangaSearchResult<Manga> | null> {
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
            fields = [...MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(MANGA_FIELDS[fieldPreset] || MANGA_FIELDS["medium"]), ...extraFields];
        }

        let api_url = `${BASE_URL}/manga?q=${query}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
        const raw = await this.client.fetchData<MangaRawSearchResults>(api_url, "manga", query);

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
    async top({
        ranking_type = "all",
        limit = 100,
        offset = 0,
        fieldPreset = "medium",
        extraFields = [],
    }: {
        ranking_type?: string | RANKING_MANGA;
        limit?: number;
        offset?: number;
        fieldPreset?: keyof typeof MANGA_FIELDS | string[];
        extraFields?: string[];
    } = {}): Promise<MangaSearchResult<Manga> | null> {
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

        let fields: string[];

        // Check if fieldPreset is an array or a preset string
        if (Array.isArray(fieldPreset)) {
            fields = [...MANGA_FIELDS["medium"], ...fieldPreset]; // User passed a custom array
        } else {
            // Use preset + optional extra fields, default to "medium" if preset is not valid
            fields = [...(MANGA_FIELDS[fieldPreset] || MANGA_FIELDS["medium"]), ...extraFields];
        }

        let api_url = `${BASE_URL}/manga/ranking?ranking_type=${ranking_type}&limit=${limit}&offset=${offset}&fields=${fields.join(",")}`;
        const raw = await this.client.fetchData<MangaRawSearchResults>(api_url, "manga", ranking_type);

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

}
