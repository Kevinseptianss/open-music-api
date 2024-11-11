require("dotenv").config();
const Hapi = require("@hapi/hapi");

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

const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const musicsServices = new MusicsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();

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
