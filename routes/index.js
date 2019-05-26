var usersController = require("./users");
var projectsController = require("./projects");
var feedComponentController = require("./feedComponent");
var linkShareComponentController = require("./linkShareComponent");
var progressComponentController = require("./progressComponent");
var passwordShareComponentController = require("./passwordShareComponent");
var authController = require("./auth");

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

router.get("/users/own",
  authController.requiresValidToken,
  usersController.getCurrentUser
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

router.get("/users/:userId/name",
  usersController.initializeUserId,
  usersController.getUserName);

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
  projectsController.projectBelongsToUser,
  feedComponentController.getFeedComponent);

router.post("/users/:userId/projects/:projectId/feedComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  feedComponentController.createFeedComponent);

router.get("/users/:userId/projects/:projectId/feedComponent/feedMessages",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  feedComponentController.getFeedMessages);

router.post("/users/:userId/projects/:projectId/feedComponent/feedMessages",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"), //everybody visitng the site should be allowed to post into the feed!
  projectsController.projectBelongsToUser,
  feedComponentController.addFeedMessage);

router.delete("/users/:userId/projects/:projectId/feedComponent/feedMessages/:feedMessageId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"), //only users with write permission may delete... but they may delete everybodies messages
  projectsController.projectBelongsToUser,
  feedComponentController.deleteFeedMessage);

router.get("/users/:userId/projects/:projectId/linkShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  linkShareComponentController.getLinkShareComponent);

router.post("/users/:userId/projects/:projectId/linkShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  linkShareComponentController.createLinkShareComponent);

router.put("/users/:userId/projects/:projectId/linkShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  linkShareComponentController.updateLinkShareComponent);

router.get("/users/:userId/projects/:projectId/progressComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("read"),
  projectsController.projectBelongsToUser,
  progressComponentController.getProgressComponent);

router.post("/users/:userId/projects/:projectId/progressComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  progressComponentController.createProgressComponent);

router.put("/users/:userId/projects/:projectId/progressComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  progressComponentController.updateProgressComponent);

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

router.delete("/users/:userId/projects/:projectId/passwordShareComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  authController.requiresValidProjectAccess("write"),
  projectsController.projectBelongsToUser,
  passwordShareComponentController.deletePasswordShareComponent);

module.exports = router;
