const baseUrl = "https://ws.audioscrobbler.com/2.0/";

const apiKey = process.env.LASTFM_API_KEY as string;

export async function getNowPlaying(username: string) {
  const url = new URL(baseUrl);
  url.searchParams.append("method", "user.getrecenttracks");
  url.searchParams.append("user", username);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("format", "json");
  url.searchParams.append("limit", "1");

  const response = await fetch(url);
  const data = await response.json();
  const track = data.recenttracks.track[0];

  return {
    name: track.name,
    artist: track.artist["#text"],
    album: track.album["#text"],
    cover: track.image[3]["#text"],
    isPlaying: track["@attr"]?.nowplaying === "true",
  };
}

export async function getUserInfo(username: string) {
  const url = new URL(baseUrl);
  url.searchParams.append("method", "user.getinfo");
  url.searchParams.append("user", username);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("format", "json");

  const response = await fetch(url);
  const data = await response.json();

  return {
    username: data.user.name,
    realname: data.user.realname,
    playcount: data.user.playcount,
    avatar: data.user.image[2]["#text"],
  };
}

export async function getTopArtists(username: string) {
  const url = new URL(baseUrl);
  url.searchParams.append("method", "user.gettopartists");
  url.searchParams.append("user", username);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("format", "json");
  url.searchParams.append("limit", "5");

  const response = await fetch(url);
  const data = await response.json();

  return data.topartists.artist.map((artist: any) => ({
    name: artist.name,
    playcount: artist.playcount,
    url: artist.url,
  }));
}

export async function getTopTracks(username: string) {
  const url = new URL(baseUrl);
  url.searchParams.append("method", "user.gettoptracks");
  url.searchParams.append("user", username);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("format", "json");
  url.searchParams.append("limit", "5");

  const response = await fetch(url);
  const data = await response.json();

  return data.toptracks.track.map((track: any) => ({
    name: track.name,
    artist: track.artist.name,
    playcount: track.playcount,
    url: track.url,
  }));
}
