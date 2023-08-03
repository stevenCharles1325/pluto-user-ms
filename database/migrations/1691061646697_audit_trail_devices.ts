import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'audit_trail_devices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('audit_trail_id').unsigned().references('audit_trails.id').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('country').notNullable()
      table.string('region').notNullable()
      table.string('latitude').notNullable()
      table.string('longitude').notNullable()
      table.string('ip_address').notNullable()

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
