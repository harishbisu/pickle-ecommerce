"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let ProductsService = class ProductsService {
    async findAll() {
        return await db_1.db.select().from(schema_1.products).orderBy(schema_1.products.id);
    }
    async findById(id) {
        const result = await db_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id)).limit(1);
        if (!result[0])
            throw new common_1.NotFoundException(`Product #${id} not found`);
        return result[0];
    }
    async create(data) {
        const result = await db_1.db.insert(schema_1.products).values({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            stock: data.stock ?? 0,
            images: data.images || [],
        }).returning();
        return result[0];
    }
    async update(id, data) {
        const updatePayload = {};
        if (data.name !== undefined)
            updatePayload.name = data.name;
        if (data.description !== undefined)
            updatePayload.description = data.description;
        if (data.price !== undefined)
            updatePayload.price = data.price.toString();
        if (data.stock !== undefined)
            updatePayload.stock = data.stock;
        if (data.images !== undefined)
            updatePayload.images = data.images;
        const result = await db_1.db.update(schema_1.products)
            .set(updatePayload)
            .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
            .returning();
        if (!result[0])
            throw new common_1.NotFoundException(`Product #${id} not found`);
        return result[0];
    }
    async delete(id) {
        const result = await db_1.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id)).returning();
        if (!result[0])
            throw new common_1.NotFoundException(`Product #${id} not found`);
        return result[0];
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map