import type { Category } from "../models/category.model.js";
import { categoryRepository } from "../repositories/category.repository.js";

class CategoryService {
	async getCategoryById(id: number): Promise<Category | null> {
		return await categoryRepository.findById(id);
	}
}

export const categoryService = new CategoryService();
