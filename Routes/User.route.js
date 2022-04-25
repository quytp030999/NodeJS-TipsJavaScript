const express = require("express");
const route = express.Router();
const { verifyAccessToken } = require("../Helpers/jwt_service");
const userController = require("../Controllers/User.controller");
const passport = require("passport");

route.post("/register", userController.register);

route.post("/refresh-token", userController.refreshToken);

route.post(
  "/login",
  passport.authenticate("local", {
    successMessage: "Login Success",
    failureMessage: "Login Fail",
  }),
  userController.login
);

route.delete("/logout", userController.logOut);

route.get("/list", verifyAccessToken, userController.list);

module.exports = route;
