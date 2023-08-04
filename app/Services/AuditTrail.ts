import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import AuditTrail from 'App/Domains/AuditTrail/Models/AuditTrail'
import User from 'App/Domains/User/Models/User'
import LogDetails from 'App/Interfaces/LogDetails'
import useragent from 'useragent'
import geoip from 'geoip-lite'
import logs from 'App/Domains/AuditTrail/Logs'

export default class AuditTrailService {
  constructor(private auditTrail: typeof AuditTrail) {}

  private async getReqAndDeviceInformation(
    auditTrailId: number,
    ctx: HttpContextContract
  ): Promise<object> {
    const ip = ctx.request.ip()
    const geo = geoip.lookup(ip)
    const agent = useragent.parse(ctx.request.header('user-agent'))

    return {
      auditTrailId,

      // Agent information
      name: agent.toAgent(),

      // Geo information
      country: geo?.country ?? 'N/A',
      region: geo?.region ?? 'N/A',
      latitude: geo?.ll?.[0] ?? 'N/A',
      longitude: geo?.ll?.[1] ?? 'N/A',
      ipAddress: ip,
    }
  }

  public async log(logDetails: LogDetails) {
    const ctx = HttpContext.get()
    const { relatedId, actionType, description } = logDetails

    const action = new logs[actionType](logDetails, ctx)
    if (ctx) {
      try {
        const id = ctx?.auth.use('jwt').user!.id
        const user = await User.findOrFail(id)
        await user.load('phoneNumbers')
        await user.load('roles')

        const log = {
          creatorId: id,
          creatorEmail: user.email,
          creatorFullName: user.fullName,
          creatorPhoneNumber: user?.phoneNumbers?.[0]?.phoneNumber,
          actionType: actionType,
          description: description ?? (await action.description()),
        }

        const createdLog = await this.auditTrail.create(log)

        if (relatedId) {
          const relatedUser = await User.findOrFail(relatedId)
          await relatedUser.load('phoneNumbers')

          const related = {
            auditTrailId: createdLog.id,
            relatedId: relatedUser.id,
            relatedEmail: relatedUser.email,
            relatedPhoneNumber: relatedUser?.phoneNumbers?.[0]?.phoneNumber,
            relatedFullName: relatedUser.fullName,
          }

          console.log('[AUDIT TRAIL]: Successfully created log related user')
          await createdLog.related('relatedUsers').create(related)
        }

        const deviceInfo = await this.getReqAndDeviceInformation(createdLog.id, ctx)

        await createdLog.related('device').create(deviceInfo)
        console.log('[AUDIT TRAIL]: Successfully created log device information')

        console.log('[AUDIT TRAIL]: Successfully created log')
        return createdLog
      } catch (err) {
        console.log(err)

        throw new Error(err)
      }
    }

    throw new Error('[AUDIT TRAIL]: Cannot access HTTP context')
  }
}
