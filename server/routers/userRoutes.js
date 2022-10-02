const express = require("express");
const { register, login, logout, checkRival, getPastGames } = require("../controllers/userController");
const router = express.Router();
const auth = require('../middleware/auth')

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout)
router.post("/allusers/:username", checkRival)
router.post("/pastgames/:username", getPastGames)

module.exports = router;
