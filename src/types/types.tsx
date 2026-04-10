export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    accessToken: string;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    rating: number;
    thumbnail: string;
    category: string;
}

export interface ProductDetail extends Product {
    description: string;
    stock: number;
    images: string[];
    warrantyInformation: string;
    shippingInformation: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Category {
    slug: string;
    name: string;
    url: string;
}