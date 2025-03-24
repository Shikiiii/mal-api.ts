export interface Anime {
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
    episodes?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    genres?: { id: number; name: string }[];
    studios?: { id: number; name: string }[];
    source?: string;
    rating?: string;
    nsfw?: boolean;
    broadcast?: string;
    user_amount?: number;
    user_scored_amount?: number;
    created_at?: string;
    updated_at?: string;
    type?: string;
    my_list_status?: {
        status?: string,
        score?: number,
        episodes_watched?: number,
        is_rewatching?: boolean,
        updated_at?: string
    };
    start_season?: string;
    average_episode_duration?: number;
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
}


export interface RawAnime {
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
    num_episodes?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    genres?: any[];
    studios?: any[];
    source?: string;
    rating?: string;
    nsfw?: string; // Could be "white" or some other value
    broadcast?: string;
    num_list_users?: number;
    num_scoring_users?: number;
    created_at?: string;
    updated_at?: string;
    media_type?: string;
    my_list_status?: {
        status?: string,
        score?: number,
        num_episodes_watched?: number,
        is_rewatching?: boolean,
        updated_at?: string
    };
    start_season?: string;
    average_episode_duration?: number;
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
}


export interface AnimeRawSearchResults {
    data: { node: RawAnime }[];
    paging?: {
        previous?: string;
        next?: string;
    }
}


export interface AnimeSearchResult<T> {
    results: { anime?: Anime }[];
    hasNext?: boolean;
    hasPrev?: boolean;
    next?: () => Promise<AnimeSearchResult<T>>;
    prev?: () => Promise<AnimeSearchResult<T>>;
}