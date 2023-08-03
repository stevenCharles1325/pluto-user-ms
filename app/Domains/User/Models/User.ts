import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import axios from 'axios'
import search from 'App/Modules/Scopes/search'
import Role from 'App/Models/Role'
import PhoneNumber from 'App/Domains/PhoneNumber/Models/PhoneNumber'

export default class User extends BaseModel {
  @beforeSave()
  public static async fillEmptyUsername(user: User) {
    const generateUsename = async () => {
      console.log('GENERATING USERNAME...')

      const url = 'https://randomuser.me/api/?inc=login'
      const results = await axios
        .get(url)
        .then((res) => res.data.results)
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

  @computed()
  public get fullName() {
    if (this.middleName) {
      return string.titleCase(`${this.firstName} ${this.middleName} ${this.lastName}`)
    } else {
      return string.titleCase(`${this.firstName} ${this.lastName}`)
    }
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column({
    prepare: (value: string) => value.toLowerCase(),
  })
  public firstName: string

  @column({
    prepare: (value: string) => value.toLowerCase(),
  })
  public middleName: string

  @column({
    prepare: (value: string) => value.toLowerCase(),
  })
  public lastName: string

  @column({
    prepare: (value: string) => value.toLowerCase(),
  })
  public address: string

  @column()
  public gender: string

  @hasMany(() => PhoneNumber)
  public phoneNumbers: HasMany<typeof PhoneNumber>

  @column({
    prepare: (value) => value?.toFormat('yyyy-MM-dd HH-mm-ss'),
  })
  public birthDate: DateTime

  @column()
  public rememberMeToken: string | null

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
  })
  public roles: ManyToMany<typeof Role>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async softDelete() {
    this.deletedAt = DateTime.now()
    this.save()
  }

  public static search = search(
    ['id', 'birth_date', 'created_at', 'updated_at', 'gender', 'email'],
    ['first_name', 'middle_name', 'last_name', 'username', 'address']
  )
}
