import { IsString, IsNumber, IsOptional, IsArray, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @IsString({ message: 'Product description must be a string' })
  description: string;

  @IsNumber({}, { message: 'Product price must be a number' })
  @Min(0, { message: 'Product price must be greater than or equal to 0' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock?: number;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Product price must be a number' })
  @Min(0, { message: 'Product price must be greater than or equal to 0' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock?: number;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];
}
