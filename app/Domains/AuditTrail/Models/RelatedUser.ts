import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import AuditTrail from './AuditTrail'
import User from 'App/Domains/User/Models/User'

export default class RelatedUser extends BaseModel {
  public static table = 'audit_trail_related_users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public relatedEmail: string

  @column()
  public relatedFullName: string

  @column()
  public relatedPhoneNumber?: string | number

  @column()
  public relatedId: number

  @hasOne(() => User, {
    foreignKey: 'relatedId',
  })
  public relatedUser: HasOne<typeof User>

  @column()
  public auditTrailId: number

  @hasOne(() => AuditTrail, {
    foreignKey: 'auditTrailId',
  })
  public auditTrail: HasOne<typeof AuditTrail>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
