import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'audit_trails'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('creator_id').unsigned().references('users.id').nullable().onDelete('SET NULL')
      table.string('creator_email').notNullable()
      table.string('creator_full_name').notNullable()
      table.string('creator_phone_number').nullable()

      table.string('action_type').notNullable()
      table.string('description').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
