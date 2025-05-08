// hooks/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Replace with your API base URL
// export const API_BASE = 'http://localhost:8000/api';

// // Ali's API base URL
export const API_BASE = 'http://192.168.8.108:8000/api';
// Ali's labtop API base URL
// export const API_BASE = 'http://192.168.3.32:8000/api';

const fetchProduct = async (barcode: string) => {
  try {
    const response = await axios.get(`${API_BASE}/products/${barcode}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Product not found: ${error.message}`);
  }
};

export const useProduct = (barcode: string) => {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode, // Auto-enable when barcode exists
    retry: 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

