const bcrypt = require("bcryptjs")
const db = require("../database/dbConfig")

function find() {
  return db("users")
    .select("id", "username")
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .select("id", "username", "password")
}

async function add(user) {
  // second parameter is the time complexity, not the number of rounds.
  // bcrypt is based on the blowfish cipher, which says that the rounds
  // is 2 to the power of the time complexity.
  //
  // in other words, 2^14 === 16,384 rounds
  user.password = await bcrypt.hash(user.password, 14)

  const [id] = await db("users")
    .insert(user)
 
  return findById(id)
}

function findById(id) {
  return db("users")
    .where({ id })
    .first("id", "username")
}

module.exports = {
  add,
  find,
  findBy,
  findById,
}