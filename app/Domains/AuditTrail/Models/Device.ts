import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AuditTrail from './AuditTrail'

export default class Device extends BaseModel {
  public static table = 'audit_trail_devices'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public country: string

  @column()
  public region: string

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public ipAddress: number

  @column()
  public auditTrailId: number

  @hasOne(() => AuditTrail, {
    foreignKey: 'auditTrailId',
  })
  public auditTrail: HasOne<typeof AuditTrail>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
