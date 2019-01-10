import { createError } from 'apollo-errors'

const errors = {
  AuthorizationError: createError('AuthorizationError', {
    message: 'You are not authorized here'
  })
}

export default errors