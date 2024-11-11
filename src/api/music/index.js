const MusicHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "musics",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const musicsHandler = new MusicHandler(service, validator);
    server.route(routes(musicsHandler));
  },
};
