export interface InputListCustomerDto {}

type Customer = {
  id: string;
  name: string;
  address: {
    street: string;
    number: string;
    zipcode: string;
    city: string;
  };
};

export interface OutputListCustomerDto {
  customers: Customer[];
}
