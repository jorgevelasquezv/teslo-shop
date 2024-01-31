import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    format: 'uuid',
    description: 'This property must be a valid uuid ',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '1740176-00-A_0_2000.jpg',
    description: 'This property corresponds to the images of the product.',
  })
  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product: Product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
