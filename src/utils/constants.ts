export const BASE_URL = "https://api.myanimelist.net/v2";

export const ANIME_FIELDS = {
    basic: ["id", "title", "main_picture"],
    medium: ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"],
    full: [
        "id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity",
        "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios",
        "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season",
        "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations",
        "statistics"
    ],
} as const;


export const MANGA_FIELDS = {
    basic: ["id", "title", "main_picture"],
    medium: ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"],
    full: [
        "id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity",
        "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios",
        "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season",
        "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations",
        "statistics", "serialization", "authors{id,first_name,last_name}"
    ],
} as const;


export const USER_FIELDS = {
    full: [
        "id", "name", "picture", "gender", "birthday",
        "location", "joined_at", "anime_statistics", "time_zone",
        "is_supporter"
    ]
}


export enum FIELD_PRESET {
    BASIC = "basic",
    MEDIUM = "medium",
    FULL = "full"
}


export enum RANKING_ANIME {
    ALL = "all",
    AIRING = "airing",
    UPCOMING = "upcoming",
    TV = "tv",
    OVA = "ova",
    MOVIE = "movie",
    SPECIAL = "special",
    BYPOPULARITY = "bypopularity",
    FAVORITE = "favorite",
}

export enum RANKING_MANGA {
    ALL = "all",
    MANGA = "manga",
    NOVELS = "novels",
    ONESHOTS = "oneshots",
    DOUJIN = "doujin",
    MANHWA = "manhwa",
    MANHUA = "manhua",
    BYPOPULARITY = "bypopularity",
    FAVORITE = "favorite",
}


export enum WATCHING_STATUS {
    WATCHING = "watching",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_WATCH = "plan_to_watch",
    ALL = "all"
}


export enum READING_STATUS {
    READING = "reading",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_READ = "plan_to_read",
    ALL = "all"
}


export enum WATCHING_STATUS_UPDATE {
    WATCHING = "watching",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_WATCH = "plan_to_watch",
}


export enum READING_STATUS_UPDATE {
    READING = "reading",
    COMPLETED = "completed",
    DROPPED = "dropped",
    ON_HOLD = "on_hold",
    PLAN_TO_READ = "plan_to_read",
    ALL = "all"
}