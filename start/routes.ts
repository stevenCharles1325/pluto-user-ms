import { join } from 'path'
import { requireAll } from '@ioc:Adonis/Core/Helpers'

requireAll(join(__dirname, '../app/Routes'))