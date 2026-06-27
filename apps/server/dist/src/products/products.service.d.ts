export declare class ProductsService {
    findAll(): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        specifications: unknown;
        isFeatured: boolean;
        discount: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        specifications: unknown;
        isFeatured: boolean;
        discount: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(data: {
        name: string;
        slug: string;
        description: string;
        price: number;
        stock?: number;
        images?: string[];
        specifications?: any;
        isFeatured?: boolean;
        discount?: number;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        slug: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        specifications: unknown;
        isFeatured: boolean;
        discount: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        price?: number;
        stock?: number;
        images?: string[];
        specifications?: any;
        isFeatured?: boolean;
        discount?: number;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        specifications: unknown;
        isFeatured: boolean;
        discount: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        slug: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        specifications: unknown;
        isFeatured: boolean;
        discount: string | null;
    }>;
}
