const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Token invalid");
    }
  },
};

module.exports = TokenManager;
