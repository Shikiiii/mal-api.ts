# MyAnimeList API Wrapper

![License](https://img.shields.io/github/license/Shikiiii/mal.ts)
![Version](https://img.shields.io/npm/v/malts)

mal.ts is a typescript api wrapper for the myanimelist api that makes it fast, easy and fun to interact with mal. supports all endpoints, has interfaces for every response, and most importantly, saves you a lot of time.

## Features
- Fetch anime and manga details
- Search for anime and manga
- Manage user lists
- *Almost* full OAuth2 support.
- User suggestions based on their watchlist.
- Fetch seasonal/top ranking anime.
- Pagination made as simple as it can be.

## Possibly coming
- Rate limit handling.

## Installation
```sh
npm install malts
```

## Usage
```ts
import { MAL } from "malts";

const mal = new MAL("CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI");

async function getAnime() {
  const anime = await mal.anime.get({ id: 21, fieldPreset: FIELD_PRESET.FULL }); // Gets
  //  all the details for anime ID 21
  console.log(anime);
}

getAnime();
```

## List of features
This project has full & detailed JSDocs available for ease of programming. This list will not contain all of the available arguments, just a list of available methods.
For more information, refer to the JSDocs.
### Fetching anime data
```ts
// Get an anime by its ID.
mal.anime.get({ id: 21 });

// Search for an anime.
mal.anime.search({ query: "One Piece" });

// Get top ranking anime.
mal.anime.top();

// Get anime by season.
mal.anime.season({ season: "FALL 2020"}) // or "current" for current season.
```
### Fetching manga data
```ts
// Get a manga by its ID.
mal.manga.get({ id: 43661 });

// Search for a manga.
mal.manga.search({ query: "Owari No Seraph" });

// Get top ranking manga.
mal.manga.top();
```
### Fetching user data
The examples below require authentication. This wrapper has OAuth2 helper functions that are listed below.
To just authenticate a user:
```ts
// Authenticate a user.
mal.user.auth("ACCESS_TOKEN", "REFRESH_TOKEN_(OPTIONAL)");

// Fetch user's information.
mal.user.info();

// Get anime suggested for user based on their list.
mal.user.suggested();
```
### Fetching & updating user anime list
```ts
// Fetch a user's anime list.
// THIS DOES NOT REQUIRE AUTHENTICATION, UNLIKE THE REST OF THE METHODS.
// You can pass an optional username argument.
// But note that if a user's anime list is private, it 
// cannot be fetched without authentication.
mal.user.animelist.get();

// Update a user's anime list.
mal.user.animelist.update({ id: 21, status: WATCHING_STATUS_UPDATE.COMPLETED }) 
// or status: "completed"

// Delete an entry from user's anime list.
mal.user.animelist.delete({ id: 21 });
```
### Fetching & updating user manga list
```ts
// Fetch a user's manga list.
// THIS DOES NOT REQUIRE AUTHENTICATION, UNLIKE THE REST OF THE METHODS. 
// You can pass an optional username argument.
// But note that if a user's manga list is private, it 
// cannot be fetched without authentication.
mal.user.mangalist.get();

// Update a user's manga list.
mal.user.mangalist.update({ id: 43661, status: READING_STATUS_UPDATE.READING, chapter: 54 }) 
// or status: "reading"

// Delete an entry from user's manga list.
mal.user.mangalist.delete({ id: 43661 });
```
### OAuth helper methods
```ts
// Get a link for a user to authenticate themselves. In order to use this,
// you must have passed Client ID, Client Secret (if your app is web) and
// a redirect URL when initializing MAL.
mal.oauth.get_link();

// Exchange the code you receive as a URL query once a user authenticates
// themselves for an Access and Refresh token.
// Code is taken from the URL query, State & Code_Verifier are returned from
// get_link() alongside with the URL.
mal.oauth.verify_login("CODE", "STATE", "CODE_VERIFIER");

// Refresh an access token via the refresh token.
mal.oauth.refresh_access_token("REFRESH_TOKEN");

// Check if an access token is expired.
mal.oauth.is_token_expired("ACCESS_TOKEN");

// Get an access token's expiration datetime (in unix format).
mal.oauth.get_token_expiration("ACCESS TOKEN");
```
### Pagination
Pagination is fully supported and made as simple as it can be for any method
that can have multiple pages of results.
```ts
// Fetch some random search results.
const results = await mal.anime.search({ query: "Owari No Seraph" });

// Fetch the next page.
if (results?.next) {
  const secondPage = await results.next();
}
```
or
```ts
// Fetch the first page of results
let results = await mal.anime.search({ query: "Owari No Seraph" });
const fullResults = results?.results;

// While-loop until no more pages
while (results?.next) {
  results = await results.next();
  fullResults.push(...results?.results);
}
```

## Contributing
Any contributions are welcome and very appreciated. 💝
1. Fork the repository.
2. Clone your fork: `git clone https://github.com/Shikiiii/mal.ts.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature-name`
5. Commit your changes: `git commit -m "Add feature"`
6. Push to GitHub: `git push origin feature-name`
7. Open a Pull Request!

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
