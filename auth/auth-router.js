const bcrypt = require("bcryptjs")
const express = require("express")
const restricted = require("../middleware/restricted")
const usersModel = require("../users/users-model")

const router = express.Router()

router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body)
    
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await usersModel.findBy({ username }).first()
    // since bcrypt hashes generate different results due to the salting,
    // we rely on the magic internals to compare hashes (rather than doing
    // it manulally by re-hashing and comparing)
    const passwordValid = await bcrypt.compare(password, user.password)

    if (user && passwordValid) {
      // stores the user data in the current session,
      // so it persists between requests
      req.session.user = user

      res.status(200).json({
        message: `Welcome ${user.username}!`,
      })
    } else {
      res.status(401).json({
        message: "Invalid Credentials",
      })
    }
  } catch (err) {
    next(err)
  }
})

router.get("/protected", restricted(), async (req, res, next) => {
  // we're already authorized here because of the `restricted` middleware
  try {
    res.json({
      message: "You are authorized",
    })
  } catch (err) {
    next(err)
  }
})

router.get("/logout", restricted(), (req, res, next) => {
  // deletes the session on the server, but not the client's cookie.
  // we can't force the client to delete the cookie, it just becomes useless to them.
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.json({
        message: "You are logged out",
      })
    }
  })
})

module.exports = router