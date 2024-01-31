import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    format: 'uuid',
    description: 'This property must be a valid uuid ',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "Men's Let the Sun Shine Tee",
    description: 'This property corresponds to the product title',
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    format: 'float',
    example: 35.1,
    description: 'This property corresponds to the price of the product',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example:
      "Inspired by the world’s most unlimited resource, the Let the Sun Shine Tee highlights our fully integrated home solar and storage system. Designed for fit, comfort and style, the tee features a sunset graphic along with our Tesla wordmark on the front and our signature T logo printed above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
    description: 'This property corresponds to the product description',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'men_let_the_sun_shine_tee',
    description:
      'This property corresponds to the tag for product name of the product',
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    format: 'integer',
    description: 'This property corresponds to the price of the product',
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    format: 'array',
    example: ['XS', 'S', 'XL', 'XXL'],
    description:
      'This property corresponds to the size or measurement of the product.',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description:
      'This property relates the associated gender to that of the product.',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    format: 'array',
    example: ['shirt'],
    description: 'This property corresponds to the tag of the product.',
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    format: 'array',
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description: 'This property corresponds to the images of the product.',
  })
  @OneToMany(
    () => ProductImage,
    (productImage: ProductImage) => productImage.product,
    {
      cascade: true,
      eager: true,
    },
  )
  images?: ProductImage[];

  @ApiProperty()
  @ManyToOne(() => User, (user: User) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlogInsertOrUpdate() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }
}
