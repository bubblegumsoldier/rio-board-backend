var usersController = require("./users");
var projectsController = require("./projects");
var feedComponentController = require("./feedComponent");
var linkShareComponentController = require("./linkShareComponent");
var passwordShareComponentController = require("./passwordShareComponent");
var authController = require("./auth")

var router = require("express").Router();

router.post("/auth",
  authController.validateUsernameAndPassword
);

router.post("/users",
  usersController.createUser
);

router.put("/users/own",
  authController.requiresValidToken,
  usersController.updateUser
);

router.delete("/users/own",
  authController.requiresValidToken,
  usersController.deleteUser
);

router.get("/users/:userId",
  usersController.initializeUserId,
  authController.requiresValidToken,
  authController.requiresMatchingUserId,
  usersController.getUser);

router.get("/users/:userId/projects",
  usersController.initializeUserId,
  authController.requiresValidToken,
  authController.requiresMatchingUserId,
  projectsController.getAllProjects);

router.post("/users/:userId/projects",
  usersController.initializeUserId,
  authController.requiresValidToken,
  authController.requiresMatchingUserId,
  projectsController.createProject);

router.get("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.getProject);

router.put("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.updateProject);

router.delete("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.deleteProject);

router.get("/users/:userId/projects/:projectId/feedComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  feedComponentController.getFeedComponent);

router.post("/users/:userId/projects/:projectId/feedComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  feedComponentController.createFeedComponent);

router.get("/users/:userId/projects/:projectId/feedComponent/feedMessages",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  feedComponentController.getFeedMessages);

router.post("/users/:userId/projects/:projectId/feedComponent/feedMessages",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  feedComponentController.addFeedMessage);

router.get("/users/:userId/projects/:projectId/linkShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  linkShareComponentController.getLinkShareComponent);

  //requires query param "password" (= SHA-1 encrypted password)
router.get("/users/:userId/projects/:projectId/passwordShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  passwordShareComponentController.getPasswordShareComponent);

router.post("/users/:userId/projects/:projectId/passwordShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  passwordShareComponentController.createPasswordShareComponent);

  //requires query param "password" (= SHA-1 encrypted password)
router.put("/users/:userId/projects/:projectId/passwordShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  passwordShareComponentController.updatePasswordShareComponent);

module.exports = router;
