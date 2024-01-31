import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const adminUser = await this.insertUsers();

    const { products } = initialData;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, adminUser));
    });

    Promise.all(insertPromises);

    return { message: 'Seed executed' };
  }

  private async deleteTables() {
    await this.productService.deletedAllProducts();
    await this.userRepository.delete({});
  }

  private async insertUsers(): Promise<User> {
    const { users } = initialData;

    const usersCreated: User[] = [];

    users.forEach(({ password, ...userData }) => {
      usersCreated.push(
        this.userRepository.create({
          ...userData,
          password: bcrypt.hashSync(password, 10),
        }),
      );
    });

    const dbUsers = await this.userRepository.save(usersCreated);

    return dbUsers[0];
  }
}
