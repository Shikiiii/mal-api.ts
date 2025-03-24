"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mal_1 = require("./mal");
const readline_1 = __importDefault(require("readline"));
const mal = new mal_1.MAL("2cf0f33fa3ac07ca567f4e04c5eece0a", "64f923885148a7efece893c1cf06652b5998b6392c20db21c8ea38d18ddd7a66", "https://example.com/");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const link = yield mal.oauth.get_link();
            console.log(link.url);
            // what is the equalivalent to input() in python here?
            const rl = readline_1.default.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question("Enter the code: ", (code) => __awaiter(this, void 0, void 0, function* () {
                const verify = yield mal.oauth.verify_login(code, link.state, link.code_verifier);
                console.log(verify.access_token);
                console.log(verify);
            }));
            let anime = yield mal.anime.get({ id: 21, fieldPreset: FIELD_PRESETS.full });
            //await mal.user.auth("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJlM2JlN2NlNjY2NGFhODM0ZTBjOTJlNWE3MzBjZDZlZTU3Njc1MzI0NzI4NmE5MWEwNTk3MGE5MmM5ODA1ZWNkYWYyYzEwNThlNjExYzExIn0.eyJhdWQiOiIyY2YwZjMzZmEzYWMwN2NhNTY3ZjRlMDRjNWVlY2UwYSIsImp0aSI6ImJlM2JlN2NlNjY2NGFhODM0ZTBjOTJlNWE3MzBjZDZlZTU3Njc1MzI0NzI4NmE5MWEwNTk3MGE5MmM5ODA1ZWNkYWYyYzEwNThlNjExYzExIiwiaWF0IjoxNzQyMjk5MzkwLCJuYmYiOjE3NDIyOTkzOTAsImV4cCI6MTc0NDk3Nzc5MCwic3ViIjoiNjc3ODk4NiIsInNjb3BlcyI6W119.ky3LtYLdXldeKEY48op-6Ce7pqhNZwO-4pzzMAqeNo3ZdSPVbX1v1cVNat5Z4RCat7w7-EWQVfigvAXZFvdNuFV-Seisw-qBGprx__WpwrhXQ0HKC1Djaye1aBq6AgDI8lpc1JfuJKDDXHUP8dtZjc9FaggLdRco3Tg5PdIqqd0Thc861ISGHmXBtvKmRnijj1utpzfkwnW9KRBDBczXZvu00DBcziofVPrEeExxMzxZ6pUH2QRbdoN4gQ1ejYrfbG2r8RdMExF2voOJYESeu8vBriwHh6xNCAawYumZJT43uKZmDRVTS9i9asKv06ZWAjndAmyq8cFE6zdrnM-HlA")
            //const anime = await mal.user.info();
            //console.log(anime);
            /*const update_entry = await mal.user.mangalist.update({ id: 57035, chapters: 3, score: 8 });
            console.log(update_entry);
    
    
            const deleted_entry = await mal.user.mangalist.delete({ id: 57035 });
            if (deleted_entry) {
                console.log(`Successfully deleted manga with ID 58939 from user's anime list.`);
            } else {
                console.log("ERROR!");
            }
    
            const animelist = await mal.user.mangalist.get({ fieldPreset: "full" });
            console.log(animelist);
            console.log(animelist?.results[0].manga);
    */
            //const suggested = await mal.user.suggested({ fieldPreset: "full" });
            //console.log(suggested);
            //console.log(suggested?.results[0].anime);
            //const test_manga = await mal.manga.get({ id: 43661, fieldPreset: "full" });
            //console.log(test_manga);
            //console.log(anime?.results[0].anime);
            //console.log(manga?.authors?.[0]?.author);
            //console.log(manga?.serialization?.[0].node);
            //console.log(manga?.results?.[0]);
            //console.log(manga?.results?.[0]?.anime?.banner);
            //let ne: MangaSearchResult<Manga>;
            //if (anime?.prev) {
            //    let next: AnimeSearchResult<Anime> = await anime.prev();
            //    console.log("This is previous: ", next);
            //}
        }
        catch (error) {
            if (error instanceof mal_1.MAL.AnimeDoesNotExist) {
                console.error(error); // Log the full error object
            }
            else {
                console.error("Unexpected error:", error);
            }
        }
    });
}
main();
//# sourceMappingURL=test.js.map