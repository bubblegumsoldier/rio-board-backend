var usersController = require("./users");
var projectsController = require("./projects");
var feedComponentController = require("./feedComponent");

var router = require("express").Router();

router.get("/users",
  usersController.getAllUsers);

router.get("/users/:userId",
  usersController.initializeUserId,
  usersController.getUser);

router.get("/users/:userId/projects",
  usersController.initializeUserId,
  projectsController.getAllProjects);

router.post("/users/:userId/projects",
  usersController.initializeUserId,
  projectsController.createProject);

router.get("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  projectsController.getProject);

router.put("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  projectsController.updateProject);

router.delete("/users/:userId/projects/:projectId",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  projectsController.deleteProject);

router.get("/users/:userId/projects/:projectId/feedComponent",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  feedComponentController.getFeedComponent);

router.get("/users/:userId/projects/:projectId/feedComponent/feedMessages",
  usersController.initializeUserId,
  projectsController.initializeProjectId,
  feedComponentController.getFeedMessages);

module.exports = router;
