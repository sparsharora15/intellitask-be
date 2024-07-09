const express = require("express");
const Project = require("../controllers/projects");
const { validateToken } = require('../middleware/authUser')
const { isUserProjectOwner } = require('../middleware/checkIfUserIsProjectOwner')
const router = express.Router();
router.post("/create", validateToken, Project.create);
router.put("/update/:projectId",validateToken, isUserProjectOwner, Project.update);
router.delete("/delete/:projectId", isUserProjectOwner, Project.delete);
router.get("/get/:projectId",validateToken, isUserProjectOwner, Project.getProjectById);
router.get("/get",validateToken, Project.getAllProjectsByUserId);

module.exports = router;
