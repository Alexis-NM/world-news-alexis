import { categoryRepository } from "../repositories/category.repository.js";
import { Category } from "../models/category.model.js";

class CategoryService {
  async getCategoryById(id: number): Promise<Category | null> {
    return await categoryRepository.findById(id);
  }
}

export const categoryService = new CategoryService();
