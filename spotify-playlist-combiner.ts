import SpotifyWebApi = require("spotify-web-api-node");
import config from "config";

const pagingParams = "next,offset,total,limit";
const itemFields = "added_by.id,track(uri)";
const apiFields = `${pagingParams},items(${itemFields})`;

async function loadPlaylistContents(api: SpotifyWebApi, playlistId: string) {
  let items: SpotifyApi.PlaylistTrackObject[] = [];

  let paging: SpotifyApi.PlaylistTrackResponse | undefined;
  do {
    const nextOffset = paging ? paging.offset + paging.limit : 0;
    console.log(
      "Playlist",
      playlistId,
      ": Loading offset",
      nextOffset,
      "of",
      paging?.total ?? "unknown",
      "tracks"
    );

    const resp = await api.getPlaylistTracks(playlistId, {
      fields: apiFields,
      offset: nextOffset,
    });
    paging = resp.body;

    items = items.concat(paging.items);
  } while (paging.next != null);

  return items;
}

async function main() {
  const credentials = config.get("credentials") as any; /* Credentials */
  const api = new SpotifyWebApi(credentials);

  const inputPlaylistIds: string[] = config.get("input_playlists");

  // First, load all playlists
  let allTracks: SpotifyApi.PlaylistTrackObject[] = [];
  for (const playlistId of inputPlaylistIds) {
    const tracks = await loadPlaylistContents(api, playlistId);
    allTracks = allTracks.concat(tracks);
  }

  // Filter to only tracks we want to include
  if (config.has("filter_creator")) {
    const filterCreator: string = config.get("filter_creator");
    allTracks = allTracks.filter((item) => item.added_by.id == filterCreator);
  }

  // Add all tracks to a new playlist
  // Can add at most 100 at a time
  const outputPlaylistId: string = config.get("output_playlist");
  let totalCount = 0;
  while (allTracks.length > 0) {
    const tracksToAdd = allTracks.splice(0, 100).map((item) => item.track.uri);
    totalCount += tracksToAdd.length;

    console.log(
      "Adding",
      tracksToAdd.length,
      "tracks to output playlist;",
      allTracks.length,
      "remaining after"
    );
    await api.addTracksToPlaylist(outputPlaylistId, tracksToAdd);
  }

  console.log("Done. Added", totalCount, "total tracks to output playlist");
}

if (require.main === module) {
  main();
}
