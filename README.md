# pomoshtnik

This is a generic helper bot for Discord.

It can talk to TMDB for movie & TV queries as well as ISBNDB for book data.

## Required environment variables

A file called `.env` being put in the root directory of the project with the
following keys in it will result in these automatically being read into the
app. You may also set them manually:

```env
DISCORD_API_KEY="DiscordAPIKEYHERE"
TMDB_API_KEY="TMDBAPIKEYHERE"
ISBNDB_KEY="ISBNDBKEYHERE"
```
