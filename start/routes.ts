import { join } from 'path'
import { requireAll } from '@ioc:Adonis/Core/Helpers'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    requireAll(join(__dirname, '../app/Routes/V1'))
  }).prefix('v1')
}).prefix('api')
