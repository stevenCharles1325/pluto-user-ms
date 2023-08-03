import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PhoneNumberUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    countryCode: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(1),
      rules.unique({
        table: 'phone_numbers',
        column: 'user_id',
        whereNot: {
          id: this.ctx.request.params()?.id ?? this.ctx.auth.use('jwt').user!.id,
        },
      }),
    ]),
    phoneNumber: schema.string.optional({ trim: true, escape: true }, [
      rules.mobile(),
      rules.unique({
        table: 'phone_numbers',
        column: 'user_id',
        whereNot: {
          id: this.ctx.request.params()?.id ?? this.ctx.auth.use('jwt').user!.id,
        },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'countryCode.minLength': 'Invalid country code',
    'phoneNumber.mobile': 'Phone number is invalid',
  }
}
