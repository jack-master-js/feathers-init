// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.Optional(Type.String())
  },
  { $id: 'User', additionalProperties: false }
)
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'password'], {
  $id: 'UserData'
})
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'email'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    // We want to be able to get a list of all users but
    // only let a user modify their own data otherwise
    if (context.params.user && context.method !== 'find') {
      return context.params.user.id
    }

    return value
  }
})
