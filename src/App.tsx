import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProduct';
import type { Category } from './types/types';
import { ProductDetail } from './desing/components/ProductDetail';

import './index.css'

export default function App() {
  const { token, login, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);


  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [authError, setAuthError] = useState('');

  const { products, loading, error, refetch } = useProducts(token, logout, selectedCategory);


  useEffect(() => {
    if (token) {
      fetch('https://dummyjson.com/products/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setCategories);
    }
  }, [token]);

  // HU-05: Favoritos
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const favoriteCount = useMemo(() => favorites.length, [favorites]);

  const handleLogout = () => {
    setFavorites([]);
    logout();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">ShopScope Login</h1>
          <input className="w-full border p-2 mb-2" placeholder="Usuario" onChange={e => setUser(e.target.value)} />
          <input className="w-full border p-2 mb-4" type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} />
          {authError && <p className="text-red-500 text-sm mb-2">{authError}</p>}
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => login(user, pass).catch(e => setAuthError(e.message))}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ShopScope</h1>
        <div className="flex items-center gap-4">
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
            ❤️ {favoriteCount}
          </span>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">Cerrar Sesión</button>
        </div>
      </header>

      <main className="p-6">
        {/* Filtros de Categoría */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-full border ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Todos
          </button>
          {categories.slice(0, 10).map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full border ${selectedCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Listado de Productos */}
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <button onClick={refetch} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Reintentar</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative cursor-pointer" onClick={() => setSelectedProductId(product.id)}>
                  <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold truncate w-40">{product.title}</h3>
                    <button onClick={() => toggleFavorite(product.id)} className="text-xl">
                      {favorites.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p className="text-blue-600 font-semibold">${product.price}</p>
                  <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {selectedProductId && (
        <ProductDetail
          id={selectedProductId}
          token={token}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}