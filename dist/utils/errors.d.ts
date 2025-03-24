export declare class AnimeDoesNotExist extends Error {
    constructor(id__q: number | string);
}
export declare class MangaDoesNotExist extends Error {
    constructor(id__q: number | string);
}
export declare class InvalidCredentials extends Error {
    constructor(clientId: string);
}
export declare class UserError extends Error {
    constructor(id__q: number | string);
}
export declare class AuthFailed extends Error {
    constructor(id__q: number | string);
}
export declare class RefreshTokenExpired extends Error {
    constructor();
}
