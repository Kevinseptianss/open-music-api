/* eslint-disable */
const modelAlbums = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const modelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const modelDisplaySong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { modelAlbums, modelSongs, modelDisplaySong };
