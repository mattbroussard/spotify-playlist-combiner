# spotify-playlist-combiner

A quick script for using the Spotify Web API to copy all tracks from a set of input playlists to an output playlist, optionally filtering by the user who added the tracks.

I wrote this because I participate in multiple collaborative playlists throughout the year and at the end of the year want to combine all my own contributions to those playlists into an output playlist. It used to be easy to do this in Spotify desktop app by sorting by creator, selecting the range, re-sorting to default sort, then dragging to the new playlist; but in 2021 it seems that the app loses selection when you change the sort, making this method impossible.

Usage:

```
npm install
# ... edit config/local.json5
npm start
```

Config example in `config/example.json5`.
