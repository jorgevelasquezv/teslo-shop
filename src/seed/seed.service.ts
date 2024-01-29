import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  runSeed() {
    this.productService.deletedAllProducts();

    const { products } = initialData;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });

    Promise.all(insertPromises);

    return { message: 'Seed executed' };
  }
}
