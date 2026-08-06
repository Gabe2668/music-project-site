// api/spotify.js
export async function getAlbumInfo(albumId, spotifyAccessToken) {
  const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${spotifyAccessToken}` }
  });
  const data = await res.json();

  return {
    title: data.name,
    artist: data.artists.map(a => a.name).join(", "),
    releaseYear: data.release_date.split("-")[0],
    coverUrl: data.images[0]?.url,
    genres: data.genres // or fallback artist genres
  };
}
