import client from '@kubb/plugin-client/client'
import type { LoginUserQueryResponse, LoginUserQueryParams, LoginUser400 } from '../models/LoginUser.ts'
import type { RequestConfig } from '@kubb/plugin-client/client'
import type { QueryKey, CreateBaseQueryOptions, CreateQueryResult } from '@tanstack/svelte-query'
import { queryOptions, createQuery } from '@tanstack/svelte-query'

export const loginUserQueryKey = (params?: LoginUserQueryParams) => [{ url: '/user/login' }, ...(params ? [params] : [])] as const

export type LoginUserQueryKey = ReturnType<typeof loginUserQueryKey>

/**
 * @summary Logs user into the system
 * @link /user/login
 */
async function loginUser(params?: LoginUserQueryParams, config: Partial<RequestConfig> = {}) {
  const res = await client<LoginUserQueryResponse, LoginUser400, unknown>({ method: 'GET', url: '/user/login', params, ...config })
  return res.data
}

export function loginUserQueryOptions(params?: LoginUserQueryParams, config: Partial<RequestConfig> = {}) {
  const queryKey = loginUserQueryKey(params)
  return queryOptions({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return loginUser(params, config)
    },
  })
}

/**
 * @summary Logs user into the system
 * @link /user/login
 */
export function createLoginUser<TData = LoginUserQueryResponse, TQueryData = LoginUserQueryResponse, TQueryKey extends QueryKey = LoginUserQueryKey>(
  params?: LoginUserQueryParams,
  options: {
    query?: Partial<CreateBaseQueryOptions<LoginUserQueryResponse, LoginUser400, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? loginUserQueryKey(params)
  const query = createQuery({
    ...(loginUserQueryOptions(params, config) as unknown as CreateBaseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<CreateBaseQueryOptions, 'queryKey'>),
  }) as CreateQueryResult<TData, LoginUser400> & {
    queryKey: TQueryKey
  }
  query.queryKey = queryKey as TQueryKey
  return query
}
