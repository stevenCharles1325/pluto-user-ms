import Env from '@ioc:Adonis/Core/Env'

export const phoneNumberConfig = {
  baseURL: Env.get('NUMVERIFY_API_URL'),
  accessKey: Env.get('NUMVERIFY_API_ACCESS_KEY'),
}
