import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PhoneNumberCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    countryCode: schema.string.optional({ trim: true, escape: true }, [rules.minLength(1)]),
    phoneNumber: schema.string.optional({ trim: true, escape: true }, [rules.mobile()]),
  })

  public messages: CustomMessages = {
    'countryCode.minLength': 'Invalid country code',
    'phoneNumber.mobile': 'Phone number is invalid',
  }
}
