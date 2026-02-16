import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Category } from "../types/article.types";
import { categoryService } from "../services/category.service";

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true,
  error: null,
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Erreur lors du chargement des catégories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
    return () => controller.abort();
  }, []);

  return (
    <CategoryContext value={{ categories, loading, error }}>
      {children}
    </CategoryContext>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
