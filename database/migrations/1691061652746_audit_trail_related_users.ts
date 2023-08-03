import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'audit_trail_related_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('audit_trail_id').unsigned().references('audit_trails.id').onDelete('CASCADE')
      table.integer('related_id').unsigned().references('users.id').onDelete('SET NULL')
      table.string('related_email').notNullable()
      table.string('related_full_name').notNullable()
      table.string('related_phone_number').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
