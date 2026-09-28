import { InventoryRepository } from '../repositories/inventory.repository.js';
const repository = new InventoryRepository();
export const inventoryService = { searchMaterial: (query: string) => repository.searchMaterial(query), stockStatus: (query: string) => repository.getStockStatus(query) };
