const createError = require("http-errors");
const Users = require("../Models/User.model");
const { userValidate } = require("../Helpers/validation");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../Helpers/jwt_service");
const client = require("../Helpers/connections_redis");

var register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = userValidate(req.body);
    if (error) {
      throw createError.BadRequest(error.details[0].message);
    }

    const isExist = await Users.findOne({ username: username });
    if (isExist) {
      throw createError.Conflict(`${username} is ready been register`);
    }

    const user = new Users({
      username,
      password,
    });

    const saveUser = await user.save();

    res.json({
      status: "Success",
      element: saveUser,
    });
  } catch (error) {
    next(error);
  }
};

var refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }

    const { userId } = await verifyRefreshToken(refreshToken);

    const accessTokenNew = await signAccessToken(userId);
    const refreshTokenNew = await signRefreshToken(userId);

    res.json({
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
    });
  } catch (error) {
    next(error);
  }
};

var login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { error } = userValidate(req.body);
    if (error) {
      throw createError.BadRequest(error.details[0].message);
    }

    const user = await Users.findOne({ username: username });
    if (!user) {
      throw createError.NotFound(`${username} Not Found`);
    }

    const isValidPassword = await user.isCheckPassword(password);
    if (!isValidPassword) {
      throw createError.Unauthorized();
    }

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

var logOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError.BadRequest();
    }

    const { userId } = await verifyRefreshToken(refreshToken);

    client
      .del(userId.toString())
      .then(() => {
        res.json({
          message: "LogOut",
        });
      })
      .catch((err) => {
        throw createError.InternalServerError();
      });
  } catch (error) {
    next(error);
  }
};

var list = (req, res, next) => {
  try {
    const listUsers = [
      {
        username: "abc",
      },
      {
        username: "def",
      },
    ];

    console.log(req.payload);

    res.json({
      data: listUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  refreshToken,
  login,
  logOut,
  list,
};
