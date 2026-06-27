import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
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
    create(body: CreateProductDto): Promise<{
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        description: string;
        price: string;
        stock: number;
        images: unknown;
    }>;
    update(id: string, body: UpdateProductDto): Promise<{
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
