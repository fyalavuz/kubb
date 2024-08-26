import type { Pet } from '../models/Pet'
import { createCategory } from './createCategory'
import { createTag } from './createTag'
import { faker } from '@faker-js/faker'

export function createPet(data: NonNullable<Partial<Pet>> = {}): NonNullable<Pet> {
  return {
    ...{
      id: faker.number.int(),
      name: faker.commerce.productName(),
      category: createCategory(),
      photoUrls: faker.helpers.arrayElements([faker.string.alpha()]) as any,
      tags: faker.helpers.arrayElements([createTag()]) as any,
      status: faker.helpers.arrayElement<any>(['available', 'pending', 'sold']),
    },
    ...data,
  }
}
