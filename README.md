# pomoshtnik

This is a generic helper bot for Discord.

It can talk to TMDB for movie & TV queries as well as ISBNDB for book data.

## Required environment variables

A file called `.env` with the following keys is required, or some other way of
setting these variables (in Heroku or the like this could be done via settings):

```env
DISCORD_API_KEY="DiscordAPIKEYHERE"
TMDB_API_KEY="TMDBAPIKEYHERE"
ISBNDB_KEY="ISBNDBKEYHERE"
```
