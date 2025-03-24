export interface Manga {
    id: number;
    title: string;
    banner?: {
        medium?: { url: string };
        large?: { url: string };
    };
    alternative_titles?: string[];
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    volumes?: number,
    chapters?: number,
    status?: string;
    start_date?: string;
    end_date?: string;
    genres?: { id: number; name: string }[];
    nsfw?: boolean;
    user_amount?: number;
    user_scored_amount?: number;
    created_at?: string;
    updated_at?: string;
    type?: string;
    my_list_status?: {
        status?: string,
        score?: number,
        volumes_read?: number,
        chapters_read?: number,
        is_rereading?: boolean,
        updated_at?: string
    };
    pictures?: { large?: string, medium?: string }[];
    background?: string;
    related_anime?: {
        anime?: {
            id: number;
            title: string;
            main_picture?: { medium?: string; large?: string };
        }, relation_type?: string, relation_type_formatted?: string
    }[];
    related_manga?: {
        manga?: {
            id: number;
            title: string;
            main_picture?: { medium?: string; large?: string };
        }, relation_type?: string, relation_type_formatted?: string
    }[];
    recommendations?: {
        anime?: {
            id: number;
            title: string;
            main_picture?: { medium?: string; large?: string };
        }, num_recommendations?: number;
    }[];
    statistics?: {
        status_groups: {
            watching: number;
            completed: number;
            on_hold: number;
            dropped: number;
            plan_to_watch: number;
        };
        user_amount: number;
    };
    authors: any[];
    serialization: any[];
}


export interface RawManga {
    id: number;
    title: string;
    main_picture?: {
        medium?: string;
        large?: string;
    };
    alternative_titles?: string[];
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_volumes?: number,
    num_chapters?: number,
    status?: string;
    start_date?: string;
    end_date?: string;
    genres?: any[];
    nsfw?: string; // Could be "white" or some other value
    num_list_users?: number;
    num_scoring_users?: number;
    created_at?: string;
    updated_at?: string;
    media_type?: string;
    my_list_status?: {
        status?: string,
        score?: number,
        num_volumes_read?: number,
        num_chapters_read?: number,
        is_rereading?: boolean,
        updated_at?: string
    };
    pictures?: any[];
    background?: string;
    related_anime?: any[];
    related_manga?: any[];
    recommendations?: any[];
    statistics?: {
        status: {
            watching: number;
            completed: number;
            on_hold: number;
            dropped: number;
            plan_to_watch: number;
        };
        num_list_users: number;
    };
    authors: any[];
    serialization: any[];
}


export interface MangaRawSearchResults {
    data: { node: RawManga }[];
    paging?: {
        previous?: string;
        next?: string;
    }
}


export interface MangaSearchResult<T> {
    results: { manga?: Manga }[];
    hasNext?: boolean;
    hasPrev?: boolean;
    next?: () => Promise<MangaSearchResult<T>>;
    prev?: () => Promise<MangaSearchResult<T>>;
}