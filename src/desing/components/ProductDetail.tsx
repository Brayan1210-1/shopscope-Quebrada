import { useEffect, useState, useMemo } from 'react';
import type { ProductDetail as IProductDetail } from '../../types/types';

interface Props {
    id: number;
    token: string;
    onClose: () => void;
}

export const ProductDetail = ({ id, token, onClose }: Props) => {
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            });
    }, [id, token]);

    const formattedPrice = useMemo(() => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
            .format(product?.price || 0);
    }, [product?.price]);

    if (loading) return <div className="fixed inset-0 bg-white p-10">Cargando detalle...</div>;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl">×</button>
                {product && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src={product.thumbnail} alt={product.title} className="w-full rounded" />
                        <div>
                            <h2 className="text-2xl font-bold">{product.title}</h2>
                            <p className="text-gray-600 my-2">{product.description}</p>
                            <p className="text-xl font-semibold text-blue-600">{formattedPrice}</p>
                            <p className="mt-2 text-sm">Stock: {product.stock > 0 ? product.stock : <span className="text-red-500 font-bold">Sin stock</span>}</p>
                            <span className="inline-block bg-gray-200 px-2 py-1 rounded mt-4 text-xs uppercase">{product.category}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};