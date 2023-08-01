import { scope } from '@ioc:Adonis/Lucid/Orm'
import { types } from '@ioc:Adonis/Core/Helpers'

type SearchObject = [string, string[] | string]

const search = (blockSearchables: string[], keySearchables: string[]) =>
  scope((_query, _request) => {
    const searches = Object.entries(_request.qs())

    searches.forEach(([key, value]: SearchObject, index: number) => {
      if (types.lookup(value) === 'array') {
        if (!index) {
          _query.whereIn(key, value as string[])
        } else {
          _query.orWhereIn(key, value as string[])
        }
      } else {
        if (!index) {
          if (blockSearchables.includes(key)) {
            _query.where(key, value)
          }

          if (keySearchables.includes(key)) {
            _query.where(key, 'LIKE', `%${value}%`)
          }
        } else {
          if (blockSearchables.includes(key)) {
            _query.orWhere(key, value)
          }

          if (keySearchables.includes(key)) {
            _query.orWhere(key, 'LIKE', `%${value}%`)
          }
        }
      }
    })
  })

export default search
