import { Anime } from "../models/anime";
import { Manga } from "../models/manga";
export interface User {
    id: number;
    name: string;
    picture: string;
    gender: string | undefined;
    birthday: string | undefined;
    location: string | undefined;
    joined_at: string;
    anime_statistics: {
        watching?: number;
        completed?: number;
        on_hold?: number;
        dropped?: number;
        plan_to_watch?: number;
        total?: number;
        days_watched?: number;
        days_watching?: number;
        days_completed?: number;
        days_on_hold?: number;
        days_dropped?: number;
        total_days?: number;
        episodes?: number;
        rewatched?: number;
        mean_score?: number;
    };
    time_zone: string;
    is_supporter: boolean | undefined;
}
export interface RawUser {
    id: number;
    name: string;
    picture: any;
    gender: string;
    birthday: string;
    location: string;
    joined_at: any;
    anime_statistics: any;
    time_zone: any;
    is_supporter: any;
}
export interface AnimeList<T> {
    results: {
        anime?: Anime;
    }[];
    hasNext?: boolean;
    hasPrev?: boolean;
    next?: () => Promise<AnimeList<T>>;
    prev?: () => Promise<AnimeList<T>>;
}
export interface MangaList<T> {
    results: {
        manga?: Manga;
    }[];
    hasNext?: boolean;
    hasPrev?: boolean;
    next?: () => Promise<MangaList<T>>;
    prev?: () => Promise<MangaList<T>>;
}
export interface RawAnimeEntry {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    updated_at: string;
    priority: number;
    num_times_rewatched: number;
    rewatch_value: number;
    tags: string[];
    comments: string;
}
export interface AnimeEntry {
    status: string;
    score: number;
    episodes: number;
    is_rewatching: boolean;
    updated_at: string;
    priority: number;
    times_rewatched: number;
    rewatch_value: number;
    tags: string[];
    comments: string;
}
export interface RawMangaEntry {
    status: string;
    score: number;
    num_volumes_read: number;
    num_chapters_read: number;
    is_rereading: boolean;
    updated_at: string;
    priority: number;
    num_times_reread: number;
    reread_value: number;
    tags: string[];
    comments: string;
}
export interface MangaEntry {
    status: string;
    score: number;
    volumes: number;
    chapters: number;
    is_rereading: boolean;
    updated_at: string;
    priority: number;
    times_reread: number;
    reread_value: number;
    tags: string[];
    comments: string;
}
