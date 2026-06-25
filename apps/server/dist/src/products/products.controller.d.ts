import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    findOne(id: string): Promise<{
        id: number;
        name: string;
        description: string;
        price: string;
        stock: number;
        images: unknown;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(body: {
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
    update(id: string, body: {
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
    remove(id: string): Promise<{
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
