const express = require("express");
const { register, login, checkRival, getPastGames } = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:username", checkRival)
router.get("/pastgames/:username", getPastGames)
// router.get("/gameroom", createGameRoom)

module.exports = router;
