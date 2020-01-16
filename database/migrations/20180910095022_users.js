exports.up = async (knex) => {
  await knex.schema.createTable("users", (users) => {
    users.increments()
    users.string("username", 128).notNullable().unique()
    users.string("password", 128).notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("users")
}