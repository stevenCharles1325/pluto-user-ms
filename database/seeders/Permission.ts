import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import fs from 'fs'
import { join } from 'path'

export default class extends BaseSeeder {
  public async run() {
    try {
      const permissions = fs.readFileSync(
        join(__dirname, '../../app/Data/Permissions/permissions.json'),
        { encoding: 'utf8' }
      )

      const parsed = JSON.parse(permissions)

      for await (const data of parsed) {
        await Permission.updateOrCreate(data, data)
      }
    } catch (err) {
      if (err) {
        console.log('[SEEDING PERMISSIONS ERROR]')
        console.log(err)
      }
    }
  }
}
