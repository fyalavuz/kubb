/* eslint-disable no-alert, no-console */
import client from "@kubb/plugin-client/client";
import type { RequestConfig } from "@kubb/plugin-client/client";

 /**
 * @description delete a pet
 * @summary Deletes a pet
 * @link /pet/:petId
 */
export async function deletePet({ petId }: DeletePetPathParams, headers?: DeletePetHeaderParams, config: Partial<RequestConfig> = {}) {
    const res = await client<DeletePetMutationResponse, DeletePet400, unknown>({ method: "DELETE", url: `/pet/${petId}`, headers: { ...headers, ...config.headers }, ...config });
    return res.data;
}
