import { useQuery } from '@tanstack/react-query'; // Assuming you are using @tanstack/react-query

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

