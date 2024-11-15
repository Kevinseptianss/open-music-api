const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSchema, PlaylistSongSchema } = require("./schema");

const PlaylistValidator = {
  validatePlaylist: (payload) => {
    const validationResult = PlaylistSchema.validate(payload, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.details.map((err) => err.message).join(", ")
      );
    }
  },
  validatePlaylistSong: (payload) => {
    const validationResult = PlaylistSongSchema.validate(payload, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.details.map((err) => err.message).join(", ")
      );
    }
  },
};

module.exports = PlaylistValidator;
