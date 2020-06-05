const router = require("express").Router();
const gCloudUpload = require("./middlewares/googleStorage");

// Controllers
const File = require("./controllers/FileController");
const FileSearch = require("./controllers/FileSearchController");
const User = require("./controllers/UserController");
const UserProfile = require("./controllers/UserProfileController");
const ChangePassword = require("./controllers/ChangePasswordController");

// Multer
const multer = require("multer");
const multerConfig = require("./config/multer");

// Passport
const passport = require("passport");
require("./config/passport");

// File's routes
router.get(
  "/files",
  passport.authenticate("jwt", { session: false }),
  File.index
);
router.get("/info/:id", File.show);
router.get(
  "/files/search",
  passport.authenticate("jwt", { session: false }),
  FileSearch.search
);
router.post(
  "/upload",
  multer(multerConfig).single("file"),
  gCloudUpload,
  passport.authenticate("jwt", {
    session: false,
  }),
  File.create
);
router.post("/info/download/:id", File.update);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  File.delete
);

// User's routes
router.get("/users", User.index); // get all users

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  User.getUser
); // get logged user
router.post("/user", User.create); // create a new user

router.post("/user/store", User.store); // user login

router.post(
  "/user/change/password",
  passport.authenticate("jwt", { session: false }),
  User.updatePassword
); // change password from profile page

router.post("/forgot/password", ChangePassword.create);
router.post("/change/password/:token", ChangePassword.store);

router.put(
  "/user/update",
  passport.authenticate("jwt", { session: false }),
  UserProfile.update
); // update first_name and last_name
router.put(
  "/user/picture",
  multer(multerConfig).single("file"),
  gCloudUpload,
  passport.authenticate("jwt", {
    session: false,
  }),
  UserProfile.uploadPhoto
); // upload/update photo

module.exports = router;
