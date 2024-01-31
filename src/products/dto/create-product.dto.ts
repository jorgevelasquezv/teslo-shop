import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: "Men's Let the Sun Shine Tee",
    description: 'This property corresponds to the product title',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    format: 'float',
    example: 35.1,
    description: 'This property corresponds to the price of the product',
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example:
      "Inspired by the world’s most unlimited resource, the Let the Sun Shine Tee highlights our fully integrated home solar and storage system. Designed for fit, comfort and style, the tee features a sunset graphic along with our Tesla wordmark on the front and our signature T logo printed above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
    description: 'This property corresponds to the product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'men_let_the_sun_shine_tee',
    description:
      'This property corresponds to the tag for product name of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    format: 'integer',
    description: 'This property corresponds to the price of the product',
    required: false,
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    format: 'array',
    example: ['XS', 'S', 'XL', 'XXL'],
    description:
      'This property corresponds to the size or measurement of the product.',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description:
      'This property relates the associated gender to that of the product.',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    format: 'array',
    example: ['shirt'],
    description: 'This property corresponds to the tag of the product.',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    format: 'array',
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description: 'This property corresponds to the images of the product.',
    required: false,
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
