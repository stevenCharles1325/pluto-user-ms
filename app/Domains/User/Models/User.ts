import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import axios from 'axios'


export default class User extends BaseModel {
  @beforeSave()
  public static async fillEmptyUsername (user: User) {
    const generateUsename = async () => {
      console.log('GENERATING USERNAME...')
      const url = 'https://randomuser.me/api/?inc=login'
      const results = await axios.get(url)
        .then(res => res.data.results)
        .catch(console.log)
      const generatedUname = results?.[0]?.login?.username

      if (generatedUname && Boolean(await User.findBy('username', generatedUname))) {
        return await generateUsename()
      } else {
        console.log('GENERATED USERNAME: ', generatedUname)
        user.username = generatedUname
      }
    }

    if (!user.username?.length) await generateUsename()
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public first_name: string

  @column()
  public middle_name: string

  @column()
  public last_name: string

  @column()
  public address: string

  @column()
  public gender: string

  @column({
    prepare: (value) => value?.toString?.()
  })
  public birth_date: DateTime

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
