import { KnexService } from '@feathersjs/knex'
import { logger } from '../../logger.js'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService extends KnexService {
  async sayHi(data, params) {
    console.log(data)
    console.log(params)
    logger.info('say hi to client already!')
    return { msg: 'hi' }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'users'
  }
}
