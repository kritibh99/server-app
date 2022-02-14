export interface userOperations {
  userid?: number;
  suffix: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phonenumber: string;
  mailingdetails: address;
  billingdetails: address;
  residencydetails: address;
}

export interface address {
  address: string;
  city: string;
  state: string;
  postcode: string;
}
