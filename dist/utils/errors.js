"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenExpired = exports.AuthFailed = exports.UserError = exports.InvalidCredentials = exports.MangaDoesNotExist = exports.AnimeDoesNotExist = void 0;
class AnimeDoesNotExist extends Error {
    constructor(id__q) {
        super(`Anime with ID/query ${id__q} does not exist. This error may also be raised if MAL API is down.`);
        this.name = "AnimeDoesNotExist";
    }
}
exports.AnimeDoesNotExist = AnimeDoesNotExist;
class MangaDoesNotExist extends Error {
    constructor(id__q) {
        super(`Manga with ID/query ${id__q} does not exist. This error may also be raised if MAL API is down.`);
        this.name = "MangaDoesNotExist";
    }
}
exports.MangaDoesNotExist = MangaDoesNotExist;
class InvalidCredentials extends Error {
    constructor(clientId) {
        super(`Invalid client ID/access token ${clientId}. Please check your credentials again.`);
        this.name = "InvalidCredentials";
    }
}
exports.InvalidCredentials = InvalidCredentials;
class UserError extends Error {
    constructor(id__q) {
        super(`Something went wrong with endpoint ${id__q}. Please check your credentials. This error may also be raised if MAL API is down.`);
        this.name = "UserError";
    }
}
exports.UserError = UserError;
class AuthFailed extends Error {
    constructor(id__q) {
        super(`You aren't authorized. It's possible that: your access token is invalid, it has expired, or you are trying to access private anime lists without authentication.`);
        this.name = "AuthFailed";
    }
}
exports.AuthFailed = AuthFailed;
class RefreshTokenExpired extends Error {
    constructor() {
        super(`Refresh token has expired. Please re-authenticate.`);
        this.name = "RefreshTokenExpired";
    }
}
exports.RefreshTokenExpired = RefreshTokenExpired;
//# sourceMappingURL=errors.js.map