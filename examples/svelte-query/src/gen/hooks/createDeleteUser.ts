import client from '@kubb/plugin-client/client'
import type { DeleteUserMutationResponse, DeleteUserPathParams, DeleteUser400, DeleteUser404 } from '../models/DeleteUser.ts'
import type { RequestConfig } from '@kubb/plugin-client/client'
import type { CreateMutationOptions } from '@tanstack/svelte-query'
import { createMutation } from '@tanstack/svelte-query'

export const deleteUserMutationKey = () => [{ url: '/user/{username}' }] as const

export type DeleteUserMutationKey = ReturnType<typeof deleteUserMutationKey>

/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @link /user/:username
 */
async function deleteUser(username: DeleteUserPathParams['username'], config: Partial<RequestConfig> = {}) {
  const res = await client<DeleteUserMutationResponse, DeleteUser400 | DeleteUser404, unknown>({ method: 'DELETE', url: `/user/${username}`, ...config })
  return res.data
}

/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @link /user/:username
 */
export function createDeleteUser(
  options: {
    mutation?: CreateMutationOptions<
      DeleteUserMutationResponse,
      DeleteUser400 | DeleteUser404,
      {
        username: DeleteUserPathParams['username']
      }
    >
    client?: Partial<RequestConfig>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteUserMutationKey()
  return createMutation<
    DeleteUserMutationResponse,
    DeleteUser400 | DeleteUser404,
    {
      username: DeleteUserPathParams['username']
    }
  >({
    mutationFn: async ({ username }) => {
      return deleteUser(username, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}
