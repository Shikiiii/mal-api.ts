export class AnimeDoesNotExist extends Error {
    constructor(id__q) {
        super(`Anime with ID/query ${id__q} does not exist. This error may also be raised if MAL API is down.`);
        this.name = "AnimeDoesNotExist";
    }
}
export class MangaDoesNotExist extends Error {
    constructor(id__q) {
        super(`Manga with ID/query ${id__q} does not exist. This error may also be raised if MAL API is down.`);
        this.name = "MangaDoesNotExist";
    }
}
export class InvalidCredentials extends Error {
    constructor(clientId) {
        super(`Invalid client ID/access token ${clientId}. Please check your credentials again.`);
        this.name = "InvalidCredentials";
    }
}
export class UserError extends Error {
    constructor(id__q) {
        super(`Something went wrong with endpoint ${id__q}. Please check your credentials. This error may also be raised if MAL API is down.`);
        this.name = "UserError";
    }
}
export class AuthFailed extends Error {
    constructor(id__q) {
        super(`You aren't authorized. It's possible that: your access token is invalid, it has expired, or you are trying to access private anime lists without authentication.`);
        this.name = "AuthFailed";
    }
}
export class RefreshTokenExpired extends Error {
    constructor() {
        super(`Refresh token has expired. Please re-authenticate.`);
        this.name = "RefreshTokenExpired";
    }
}
//# sourceMappingURL=errors.js.map