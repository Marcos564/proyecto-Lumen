import type { Owner } from "@shared/types";

export function ownerFullName(
  owner: Pick<Owner, "firstName" | "lastName">,
): string {
  return `${owner.firstName} ${owner.lastName}`;
}
