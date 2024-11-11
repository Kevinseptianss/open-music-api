const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadSchema, SongPayloadSchema } = require("./schema");

const MusicValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.details.map((err) => err.message).join(", ")
      );
    }
  },

  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.details.map((err) => err.message).join(", ")
      );
    }
  },
};

module.exports = MusicValidator;
