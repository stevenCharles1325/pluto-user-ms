import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserUpdateValidator {
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
    first_name: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    middle_name: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    last_name: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(20),
    ]),
    email: schema.string.optional({ trim: true, escape: true }, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: {
          id: this.ctx.auth.use('jwt').user?.id,
        },
      }),
    ]),
    username: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.names),
      rules.maxLength(this.maxLength.names),
      rules.unique({
        table: 'users',
        column: 'username',
        whereNot: {
          id: this.ctx.auth.use('jwt').user?.id,
        },
      }),
    ]),
    address: schema.string.optional({ trim: true, escape: true }, [
      rules.minLength(this.minLength.addresses),
    ]),
    gender: schema.enum.optional(['male', 'female', 'prefer not to say'] as const),
    birth_date: schema.date.optional({ format: 'iso' }, [rules.before(18, 'years')]),
    password: schema.string.optional({ trim: true }, [
      rules.minLength(this.minLength.passwords),
      rules.maxLength(this.maxLength.passwords),
    ]),
  })

  public messages: CustomMessages = {
    '*': (field, rule, _, options) => {
      const split = (str: string) => str.split('_').join(' ').trim()

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
    'birth_date.before': 'you must be 18 yrs-old and above',
    'gender.enum': 'gender values must be one of these options {{ options.choices }}',
    'email.email': 'email is invalid',
  }
}