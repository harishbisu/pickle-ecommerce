import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { products } from '../db/schema';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  async findAll() {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, id))
      .limit(1);
    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }

  async create(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock?: number;
    images?: string[];
    specifications?: any;
    isFeatured?: boolean;
    discount?: number;
  }) {
    const result = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price.toString(),
        stock: data.stock ?? 0,
        images: data.images || [],
        specifications: data.specifications || {},
        isFeatured: data.isFeatured ?? false,
        discount: data.discount?.toString() || '0',
      })
      .returning();
    return result[0];
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
      specifications?: any;
      isFeatured?: boolean;
      discount?: number;
    },
  ) {
    const updatePayload: Record<string, any> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.slug !== undefined) updatePayload.slug = data.slug;
    if (data.description !== undefined)
      updatePayload.description = data.description;
    if (data.price !== undefined) updatePayload.price = data.price.toString();
    if (data.stock !== undefined) updatePayload.stock = data.stock;
    if (data.images !== undefined) updatePayload.images = data.images;
    if (data.specifications !== undefined)
      updatePayload.specifications = data.specifications;
    if (data.isFeatured !== undefined)
      updatePayload.isFeatured = data.isFeatured;
    if (data.discount !== undefined)
      updatePayload.discount = data.discount.toString();

    const result = await db
      .update(products)
      .set(updatePayload)
      .where(eq(products.id, id))
      .returning();

    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }

  async delete(id: string) {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    if (!result[0]) throw new NotFoundException(`Product #${id} not found`);
    return result[0];
  }
}
