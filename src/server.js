require("dotenv").config();
const Hapi = require("@hapi/hapi");
const musics = require("./api/");
const MusicsServices = require("../src/services/MusicsServices");
const MusicValidator = require("./validator");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const musicsServices = new MusicsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: musics,
    options: {
      service: musicsServices,
      validator: MusicValidator,
    },
  });

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
