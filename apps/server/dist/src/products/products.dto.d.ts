export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock?: number;
    images?: string[];
    specifications?: any;
    isFeatured?: boolean;
    discount?: number;
}
export declare class UpdateProductDto {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
    specifications?: any;
    isFeatured?: boolean;
    discount?: number;
}
