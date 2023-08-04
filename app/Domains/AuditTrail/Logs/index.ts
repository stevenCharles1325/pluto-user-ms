import { join } from 'path'
import { requireAll } from '@ioc:Adonis/Core/Helpers'

const userLogsDir = requireAll(join(__dirname, './User'))
const authLogsDir = requireAll(join(__dirname, './Authentication'))

const logs = {
  // User logs
  'user-create': userLogsDir!.UserCreate,
  'user-update': userLogsDir!.UserUpdate,
  'user-archive': userLogsDir!.UserArchive,
  'user-delete': userLogsDir!.UserCreate,

  // Authentication logs
  'user-login': authLogsDir!.UserLogin,
  'user-register': authLogsDir!.UserRegister,
  'user-logout': authLogsDir!.UserLogout,
}

export default logs
