const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../Helpers/connections_redis");

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: userId,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const option = {
      expiresIn: "1m", // 10s 10m
    };
    JWT.sign(payload, secret, option, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (req.isAuthenticated()) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw createError.Unauthorized();
    }

    const bearerToken = authorization.split(" ")[1];

    JWT.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(createError.Unauthorized());
        }
        return next(createError.Unauthorized(err.message));
      }
      req.payload = payload;
      next();
    });
  } else {
    console.log("Unauthorized");
    return next(createError.Unauthorized());
  }
};

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: userId,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const option = {
      expiresIn: "1y", // 10s 10m
    };
    JWT.sign(payload, secret, option, (err, token) => {
      if (err) {
        reject(err);
      } else {
        client
          .set(userId.toString(), token, {
            EX: 365 * 24 * 60 * 60,
          })
          .then(() => {
            resolve(token);
          })
          .catch((err) => {
            return reject(createError.InternalServerError());
          });
      }
    });
  });
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          reject(err);
        } else {
          client
            .get(payload.userId)
            .then((result) => {
              if (refreshToken === result) {
                return resolve(payload);
              } else {
                return reject(createError.Unauthorized());
              }
            })
            .catch((err) => {
              return reject(createError.InternalServerError());
            });
        }
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
