export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface GetOwnersResponse {
  owners: Owner[];
}