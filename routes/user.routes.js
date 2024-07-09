const express = require("express");
const { syncUserDetails,getAllUsers } = require("../controllers/user");
const { checkUser } = require("../middleware/checkUser");
const router = express.Router();

router.post("/sync", checkUser, syncUserDetails);
// router.post("/search", checkUser, search);
router.get("/get", getAllUsers);

module.exports = router;
