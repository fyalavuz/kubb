import client from '../client.ts'
import type { RequestConfig } from '../client.ts'
import type { PlaceOrderMutationRequest, PlaceOrderMutationResponse, PlaceOrder405 } from './models.ts'

/**
 * @description Place a new order in the store
 * @summary Place an order for a pet
 * @link /store/order
 */
export async function placeOrder(data?: PlaceOrderMutationRequest, config: Partial<RequestConfig<PlaceOrderMutationRequest>> = {}) {
  const res = await client<PlaceOrderMutationResponse, PlaceOrder405, PlaceOrderMutationRequest>({ method: 'POST', url: '/store/order', data, ...config })
  return res.data
}
