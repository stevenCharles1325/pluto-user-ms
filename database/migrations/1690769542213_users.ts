import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      table.string('username', 25).notNullable()
      table.string('first_name').notNullable()
      table.string('middle_name').nullable()
      table.string('last_name').notNullable()
      table.string('address', 255).nullable()
      table.enum('gender', ['male', 'female', 'prefer not to say']).nullable().defaultTo('prefer not to say')

      table.timestamp('birth_date', { useTz: true }).notNullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
