import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  async findAll() {
    return await db.select().from(products).orderBy(products.id);
  }

  async findById(id: number) {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    images?: string[];
  }) {
    const result = await db.insert(products).values({
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      stock: data.stock ?? 0,
      images: data.images || [],
    }).returning();
    return result[0];
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
    },
  ) {
    const updatePayload: Record<string, any> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.price !== undefined) updatePayload.price = data.price.toString();
    if (data.stock !== undefined) updatePayload.stock = data.stock;
    if (data.images !== undefined) updatePayload.images = data.images;

    const result = await db.update(products)
      .set(updatePayload)
      .where(eq(products.id, id))
      .returning();

    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }

  async delete(id: number) {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }
}
