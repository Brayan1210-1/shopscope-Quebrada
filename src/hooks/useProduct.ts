import { useState, useEffect } from 'react';
import type { Product, ProductsResponse } from '../types/types';

export const useProducts = (token: string | null, logout: () => void, category?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            const url = category
                ? `https://dummyjson.com/products/category/${category}`
                : 'https://dummyjson.com/products?limit=20';

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                logout();
                return;
            }
            if (!res.ok) throw new Error('Error al cargar productos');

            const data: ProductsResponse = await res.json();
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, token]);

    return { products, loading, error, refetch: fetchProducts };
};