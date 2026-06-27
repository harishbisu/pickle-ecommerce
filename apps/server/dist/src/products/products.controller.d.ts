import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    findOne(id: string): Promise<{
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
    create(body: CreateProductDto): Promise<{
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
    update(id: string, body: UpdateProductDto): Promise<{
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
    remove(id: string): Promise<{
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
