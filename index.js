const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const dbConfig = require("./database/dbConfig")
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
  resave: false, // keep it false to avoid recreating sessions that have not changed
  saveUninitialized: false, // GDPR laws against setting cookies automatically
  secret: "keep it secret, keep it safe!", // to cryptographically sign the cookie
  cookie: {
    httpOnly: true, // cannot access the cookie from JS (more secure)
    maxAge: 1000 * 60 * 60 * 24 * 7, // expire the session after 7 days
    secure: false, // in production, this should be true so the cookie header is encrypted
  },
  store: new KnexSessionStore({
    knex: dbConfig, // configured instance of knex
    createtable: true, // if the table does not exist in the db, create it automatically
  }),
}))

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to our API",
  })
})

server.use((err, req, res, next) => {
  console.log("Error:", err)

  res.status(500).json({
    message: "Something went wrong",
  })
})


server.listen(port, () => {
  console.log(`\n** Running on http://localhost:${port} **\n`)
})