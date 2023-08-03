import HttpContext from '@ioc:Adonis/Core/HttpContext'
import AuditTrail from 'App/Domains/AuditTrail/Models/AuditTrail'
import User from 'App/Domains/User/Models/User'
import LogDetails from 'App/Interfaces/LogDetails'

export default class AuditTrailService {
  constructor(private auditTrail: typeof AuditTrail) {}

  private generateDescription(logDetails: LogDetails): string {
    // const { relatedId, actionType, description } = logDetails

    return 'Sample AuditTrail Description'
  }

  public async log(logDetails: LogDetails) {
    const ctx = HttpContext.get()
    const { relatedId, description } = logDetails

    if (ctx) {
      try {
        const id = ctx?.auth.user!.id
        const user = await User.findOrFail(id)
        await user.load('phoneNumbers')
        await user.load('roles')

        const log = {
          creatorId: id,
          creatorEmail: user.email,
          creatorFullName: user.fullName,
          creatorPhoneNumber: user?.phoneNumbers?.[0].phoneNumber,
          description: description ?? this.generateDescription(logDetails),
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

          await createdLog.related('relatedUsers').create(related)
        }

        console.log('Successfully created log')
        return createdLog
      } catch (err) {
        console.log(err)

        throw new Error(err)
      }
    }

    throw new Error('Cannot access HTTP context')
  }
}
