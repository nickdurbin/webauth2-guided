module.exports = () => {
  return (req, res, next) => {
    // we have access to req.session since we installed
    // installed the express-session middleware.
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    // if we reach this point, the user is authenticated!
    next()
  }
}