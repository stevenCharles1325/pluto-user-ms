import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Domains/User/Models/User'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    const rootUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      password: 'P*d$n8gGAh^9&z4!*s$5zk',
      address: 'N/A',
      gender: 'prefer not to say',
      email: 'johndoe@gmail.com',
      birthDate: DateTime.fromISO('2005-07-31T07:55:39.000Z'),
    })

    // Assigning the System-administrator role to the user
    await rootUser.related('roles').sync([1])
  }
}
