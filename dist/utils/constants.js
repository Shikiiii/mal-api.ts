"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.READING_STATUS_UPDATE = exports.WATCHING_STATUS_UPDATE = exports.READING_STATUS = exports.WATCHING_STATUS = exports.RANKING_MANGA = exports.RANKING_ANIME = exports.FIELD_PRESET = exports.USER_FIELDS = exports.MANGA_FIELDS = exports.ANIME_FIELDS = exports.BASE_URL = void 0;
exports.BASE_URL = "https://api.myanimelist.net/v2";
exports.ANIME_FIELDS = {
    basic: ["id", "title", "main_picture"],
    medium: ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"],
    full: [
        "id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity",
        "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios",
        "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season",
        "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations",
        "statistics"
    ],
};
exports.MANGA_FIELDS = {
    basic: ["id", "title", "main_picture"],
    medium: ["id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "my_list_status"],
    full: [
        "id", "title", "alternative_titles", "main_picture", "synopsis", "mean", "rank", "popularity",
        "num_episodes", "num_list_users", "num_scoring_users", "status", "start_date", "end_date", "genres", "studios",
        "nsfw", "source", "rating", "broadcast", "created_at", "updated_at", "media_type", "my_list_status", "start_season",
        "average_episode_duration", "pictures", "background", "related_anime", "related_manga", "recommendations",
        "statistics", "serialization", "authors{id,first_name,last_name}"
    ],
};
exports.USER_FIELDS = {
    full: [
        "id", "name", "picture", "gender", "birthday",
        "location", "joined_at", "anime_statistics", "time_zone",
        "is_supporter"
    ]
};
var FIELD_PRESET;
(function (FIELD_PRESET) {
    FIELD_PRESET["BASIC"] = "basic";
    FIELD_PRESET["MEDIUM"] = "medium";
    FIELD_PRESET["FULL"] = "full";
})(FIELD_PRESET || (exports.FIELD_PRESET = FIELD_PRESET = {}));
var RANKING_ANIME;
(function (RANKING_ANIME) {
    RANKING_ANIME["ALL"] = "all";
    RANKING_ANIME["AIRING"] = "airing";
    RANKING_ANIME["UPCOMING"] = "upcoming";
    RANKING_ANIME["TV"] = "tv";
    RANKING_ANIME["OVA"] = "ova";
    RANKING_ANIME["MOVIE"] = "movie";
    RANKING_ANIME["SPECIAL"] = "special";
    RANKING_ANIME["BYPOPULARITY"] = "bypopularity";
    RANKING_ANIME["FAVORITE"] = "favorite";
})(RANKING_ANIME || (exports.RANKING_ANIME = RANKING_ANIME = {}));
var RANKING_MANGA;
(function (RANKING_MANGA) {
    RANKING_MANGA["ALL"] = "all";
    RANKING_MANGA["MANGA"] = "manga";
    RANKING_MANGA["NOVELS"] = "novels";
    RANKING_MANGA["ONESHOTS"] = "oneshots";
    RANKING_MANGA["DOUJIN"] = "doujin";
    RANKING_MANGA["MANHWA"] = "manhwa";
    RANKING_MANGA["MANHUA"] = "manhua";
    RANKING_MANGA["BYPOPULARITY"] = "bypopularity";
    RANKING_MANGA["FAVORITE"] = "favorite";
})(RANKING_MANGA || (exports.RANKING_MANGA = RANKING_MANGA = {}));
var WATCHING_STATUS;
(function (WATCHING_STATUS) {
    WATCHING_STATUS["WATCHING"] = "watching";
    WATCHING_STATUS["COMPLETED"] = "completed";
    WATCHING_STATUS["DROPPED"] = "dropped";
    WATCHING_STATUS["ON_HOLD"] = "on_hold";
    WATCHING_STATUS["PLAN_TO_WATCH"] = "plan_to_watch";
    WATCHING_STATUS["ALL"] = "all";
})(WATCHING_STATUS || (exports.WATCHING_STATUS = WATCHING_STATUS = {}));
var READING_STATUS;
(function (READING_STATUS) {
    READING_STATUS["READING"] = "reading";
    READING_STATUS["COMPLETED"] = "completed";
    READING_STATUS["DROPPED"] = "dropped";
    READING_STATUS["ON_HOLD"] = "on_hold";
    READING_STATUS["PLAN_TO_READ"] = "plan_to_read";
    READING_STATUS["ALL"] = "all";
})(READING_STATUS || (exports.READING_STATUS = READING_STATUS = {}));
var WATCHING_STATUS_UPDATE;
(function (WATCHING_STATUS_UPDATE) {
    WATCHING_STATUS_UPDATE["WATCHING"] = "watching";
    WATCHING_STATUS_UPDATE["COMPLETED"] = "completed";
    WATCHING_STATUS_UPDATE["DROPPED"] = "dropped";
    WATCHING_STATUS_UPDATE["ON_HOLD"] = "on_hold";
    WATCHING_STATUS_UPDATE["PLAN_TO_WATCH"] = "plan_to_watch";
})(WATCHING_STATUS_UPDATE || (exports.WATCHING_STATUS_UPDATE = WATCHING_STATUS_UPDATE = {}));
var READING_STATUS_UPDATE;
(function (READING_STATUS_UPDATE) {
    READING_STATUS_UPDATE["READING"] = "reading";
    READING_STATUS_UPDATE["COMPLETED"] = "completed";
    READING_STATUS_UPDATE["DROPPED"] = "dropped";
    READING_STATUS_UPDATE["ON_HOLD"] = "on_hold";
    READING_STATUS_UPDATE["PLAN_TO_READ"] = "plan_to_read";
    READING_STATUS_UPDATE["ALL"] = "all";
})(READING_STATUS_UPDATE || (exports.READING_STATUS_UPDATE = READING_STATUS_UPDATE = {}));
//# sourceMappingURL=constants.js.map