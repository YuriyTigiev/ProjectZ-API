import { AuthorizationError } from './errors'

export const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new AuthorizationError()
  }

  return next(root, args, context, info)
}
