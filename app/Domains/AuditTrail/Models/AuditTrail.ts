import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Domains/User/Models/User'
import RelatedUser from './RelatedUser'

export default class AuditTrail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public creatorEmail: string

  @column()
  public creatorFullName: string

  @column()
  public creatorPhoneNumber?: string | null

  @column()
  public creatorId: number

  @column()
  public actionType: string

  @column()
  public description: string

  @hasOne(() => User, {
    foreignKey: 'creatorId',
  })
  public creator: HasOne<typeof User>

  @hasMany(() => RelatedUser, {
    foreignKey: 'auditTrailId',
  })
  public relatedUsers: HasMany<typeof RelatedUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
