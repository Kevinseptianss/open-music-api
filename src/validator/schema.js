// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

// Schema for Album Payload
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

// Schema for Song Payload
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional(),
  albumId: Joi.string().optional(),
});

// Exporting the schemas
module.exports = {
  AlbumPayloadSchema,
  SongPayloadSchema,
};
