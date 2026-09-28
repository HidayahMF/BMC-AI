import { DeliveryRepository } from '../repositories/delivery.repository.js';
const repository = new DeliveryRepository();
export const deliveryService = { byCustomer: (code: string, from?: string, to?: string) => repository.getCustomerDeliveries(code, from, to), byNumber: (number: string) => repository.getDeliveryByNumber(number) };
