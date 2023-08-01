import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.exists({
        table: 'users',
        column: 'username',
      }),
    ]),
    password: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    'username.exists': 'Username does not exist',
    'required': '{{ field }} is required',
  }
}
