const express = require("express");
const { register, login, checkRival } = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:username", checkRival)

module.exports = router;
