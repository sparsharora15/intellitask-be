const express = require("express");
const Task = require("../controllers/tasks");
const Validation = require('../validations/tasks.validations')
const { checkTaskExists } = require("../middleware/checkIfTaskExists");
const router = express.Router();
const { validateToken } = require('../middleware/authUser')
const upload = require('../services/multer')
router.post("/create", validateToken, Validation.validateTaskCreation, upload.array('files'), Task.create);
router.put("/update/:taskId", validateToken, Validation.validateTaskUpdate, checkTaskExists, upload.array('files'), Task.update);
router.delete("/delete/:taskId", validateToken, checkTaskExists, Task.delete);
router.get("/get", validateToken, Task.getTasksByUserId);
router.get("/get/:taskId", validateToken, checkTaskExists, Task.getTaskById);
router.get("/get-project-tasks/:projectId", validateToken, Task.getTasksByProjectId);
router.post("/askAi", validateToken, Task.askAi);
router.get("/get-unsassigned-task", validateToken, Task.getAllUnassignedTaskByUserId);

module.exports = router;
