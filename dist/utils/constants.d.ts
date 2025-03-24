export declare const BASE_URL = "https://api.myanimelist.net/v2";
export declare const ANIME_FIELDS: {
    readonly basic: readonly ["id", "title", "main_picture"];
    readonly medium: readonly ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"];
    readonly full: readonly ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity", "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios", "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season", "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations", "statistics"];
};
export declare const MANGA_FIELDS: {
    readonly basic: readonly ["id", "title", "main_picture"];
    readonly medium: readonly ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"];
    readonly full: readonly ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity", "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios", "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season", "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations", "statistics", "serialization", "authors{id,first_name,last_name}"];
};
export declare const USER_FIELDS: {
    full: string[];
};
export declare enum FIELD_PRESET {
    BASIC = "basic",
    MEDIUM = "medium",
    FULL = "full"
}
export declare enum RANKING_ANIME {
    ALL = "all",
    AIRING = "airing",
    UPCOMING = "upcoming",
    TV = "tv",
    OVA = "ova",
    MOVIE = "movie",
    SPECIAL = "special",
    BYPOPULARITY = "bypopularity",
    FAVORITE = "favorite"
}
export declare enum RANKING_MANGA {
    ALL = "all",
    MANGA = "manga",
    NOVELS = "novels",
    ONESHOTS = "oneshots",
    DOUJIN = "doujin",
    MANHWA = "manhwa",
    MANHUA = "manhua",
    BYPOPULARITY = "bypopularity",
    FAVORITE = "favorite"
}
export declare enum WATCHING_STATUS {
    WATCHING = "watching",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_WATCH = "plan_to_watch",
    ALL = "all"
}
export declare enum READING_STATUS {
    READING = "reading",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_READ = "plan_to_read",
    ALL = "all"
}
export declare enum WATCHING_STATUS_UPDATE {
    WATCHING = "watching",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_WATCH = "plan_to_watch"
}
export declare enum READING_STATUS_UPDATE {
    READING = "reading",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_READ = "plan_to_read",
    ALL = "all"
}
