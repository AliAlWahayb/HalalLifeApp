import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query'; // Assuming you are using @tanstack/react-query

import { API_BASE } from './useProduct';

// Define the type for a single item from your API
export interface Ingredients {
  name: string;
  category: string;
  id_status: number;
}

// Define the type for the data returned by the API
type IngredientssList = Ingredients[];

// Define the query key
const IngredientsS_QUERY_KEY = ['Ingredientss'];

// Function to fetch the data from your API
const fetchIngredientss = async (): Promise<IngredientssList> => {
  const response = await fetch(`${API_BASE}/Search/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch Ingredientss');
  }
  return response.json();
};

// Custom hook to use in your components
export const useIngredientss = () => {
  return useQuery<IngredientssList, Error>({
    queryKey: IngredientsS_QUERY_KEY,
    queryFn: fetchIngredientss,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export interface Product {
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
}

type ProductsPage = Product[];

const INFINITE_PRODUCTS_QUERY_KEY = ['infiniteProducts'];

const fetchProductsPage = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<ProductsPage> => {
  const response = await fetch(`${API_BASE}/products?page=${pageParam}&limit=20`);
  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'N/A');
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }
  return response.json();
};

export const useInfiniteProducts = () => {
  return useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage, number | undefined>,
    typeof INFINITE_PRODUCTS_QUERY_KEY,
    number | undefined
  >({
    queryKey: INFINITE_PRODUCTS_QUERY_KEY,
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
