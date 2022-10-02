const express = require("express");
const { register, login, logout, checkRival, getPastGames } = require("../controllers/userController");
const router = express.Router();
const auth = require('../middleware/auth')

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout)
router.post("/allusers/:username", auth, checkRival)
router.post("/pastgames/:username", auth, getPastGames)
// router.get("/gameroom", createGameRoom)

module.exports = router;
