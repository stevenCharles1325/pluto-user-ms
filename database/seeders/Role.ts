import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import fs from 'fs'
import { join } from 'path'

export default class extends BaseSeeder {
  public async run() {
    try {
      const roles = fs.readFileSync(join(__dirname, '../../app/Data/Roles/roles.json'), {
        encoding: 'utf8',
      })

      const parsed = JSON.parse(roles)

      for await (const data of parsed) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { title, description = null, linked_permissions } = data

        let permissionIds: number[]
        const existence = await Role.findBy('title', title)

        if (linked_permissions.length === 1 && linked_permissions[0] === '*') {
          permissionIds = (await Permission.query()).map(({ id }) => id)
        } else {
          permissionIds = (await Permission.query().whereIn('kebab', linked_permissions)).map(
            ({ id }) => id
          )
        }

        if (!existence) {
          const role = await Role.create({
            title,
            description,
          })

          role.related('permissions').sync(permissionIds)
        } else {
          existence.related('permissions').sync(permissionIds)
        }
      }
    } catch (err) {
      if (err) {
        console.log('[SEEDING ROLES ERROR]')
        console.log(err)
      }
    }
  }
}
