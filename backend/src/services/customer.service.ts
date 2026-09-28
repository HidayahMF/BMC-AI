import { CustomerRepository } from '../repositories/customer.repository.js';
const repository = new CustomerRepository();
export const customerService = { search: (query: string) => repository.searchCustomer(query), getByCode: (code: string) => repository.getCustomerByCode(code) };
