import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    format: 'uuid',
    description: 'This property must be a valid uuid ',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    format: 'email',
    example: 'test@test.com',
    description: 'This property corresponds to the user email',
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @ApiProperty({
    format: 'password',
    example: 'AbC123456',
    pattern: '/(?:(?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
    description: 'This property corresponds to the user password',
  })
  @Column({ type: 'text', select: false })
  password: string;

  @ApiProperty({
    example: 'Peter Loan',
    description: 'This property corresponds to the user full name',
  })
  @Column({ type: 'text' })
  fullName: string;

  @ApiProperty({
    format: 'boolean',
    required: false,
    default: true,
    description: 'This property corresponds to the user is active',
  })
  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ApiProperty({
    format: 'array',
    required: false,
    default: ['user'],
    description: ' this property corresponds to de user rol',
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product: Product) => product.user)
  product: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
