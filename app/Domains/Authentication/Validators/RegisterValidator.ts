import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class RegisterValidator {
  private minLength = {
    names: 2,
    passwords: 2,
    addresses: 10,
  }

  private maxLength = {
    names: 10,
    passwords: 20,
  }

  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    middleName: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    lastName: schema.string({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    email: schema.string({ trim: true, escape: true }, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    username: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(this.maxLength.names),
      rules.unique({
        table: 'users',
        column: 'username',
      }),
    ]),
    address: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.addresses),
    ]),
    gender: schema.enum(['male', 'female', 'prefer not to say'] as const),
    birthDate: schema.date({ format: 'iso' }, [rules.before(18, 'years')]),
    passwordConfirmation: schema.string.optional({ trim: true }),
    password: schema.string({ trim: true }, [
      rules.minLength(this.minLength.passwords),
      rules.maxLength(this.maxLength.passwords),
      rules.confirmed('passwordConfirmation'),
    ]),
  })

  public messages: CustomMessages = {
    '*': (field, rule, _, options) => {
      const split = (str: string) => string.noCase(str).trim()

      switch (rule) {
        case 'minLength':
          return `${split(field)} must be at least ${options.minLength}`

        case 'maxLength':
          return `${split(field)} must be at least ${options.maxLength}`

        case 'required':
          return `${split(field)} is required`

        default:
          return `[${rule.toUpperCase()}] error in field ${split(field)}`
      }
    },
    'unique': '{{ field }} already exists',
    'passwordConfirmation.confirmed': 'passwords do not match',
    'birthDate.before': 'you must be 18 yrs-old and above',
    'gender.enum': 'gender values must be one of these options {{ options.choices }}',
    'email.email': 'email is invalid',
  }
}
