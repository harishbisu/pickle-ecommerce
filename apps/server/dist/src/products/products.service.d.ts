export declare class ProductsService {
    findAll(): Promise<{
        id: number;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
    findById(id: number): Promise<{
        id: number;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(data: {
        name: string;
        description: string;
        price: number;
        stock?: number;
        images?: string[];
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        description: string;
        price: string;
        stock: number;
        images: unknown;
    }>;
    update(id: number, data: {
        name?: string;
        description?: string;
        price?: number;
        stock?: number;
        images?: string[];
    }): Promise<{
        id: number;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        description: string;
        price: string;
        stock: number;
        images: unknown;
    }>;
}
