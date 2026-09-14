import type { Owner } from '../../types'

export function ownerFullName(owner: Pick<Owner, 'firstName' | 'lastName'>): string {
  return `${owner.firstName} ${owner.lastName}`
}
