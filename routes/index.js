var usersController = require("./users");
var projectsController = require("./projects");
var feedComponentController = require("./feedComponent");
var authController = require("./auth")

var router = require("express").Router();

router.post("/auth",
  authController.validateUsernameAndPassword
);

// router.get("/users",
//   authController.requiresValidToken,
//   usersController.getAllUsers);

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

module.exports = router;
