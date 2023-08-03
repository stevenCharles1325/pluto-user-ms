import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/User/Models/User'

export default class PhoneNumber extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public countryCode: string

  @column()
  public phoneNumber: string

  @column()
  public userId: number

  @hasOne(() => User)
  public owner: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
