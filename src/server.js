require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

//music
const musics = require("./api/music");
const MusicsServices = require("../src/services/MusicsServices");
const MusicValidator = require("./validator/music");

//users
const users = require("./api/users");
const UsersServices = require("./services/UsersServices");
const UserValidator = require("./validator/users");

//authentications
const authentications = require("./api/authentications");
const AuthenticationsServices = require("./services/AuthenticationsServices");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

//playlists
const playlists = require("./api/playlists");
const PlaylistsServices = require("./services/PlaylistsServices");
const PlaylistValidator = require("./validator/playlists");

const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const musicsServices = new MusicsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const playlistsServices = new PlaylistsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: musics,
      options: {
        service: musicsServices,
        validator: MusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsServices,
        validator: PlaylistValidator,
      }
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
