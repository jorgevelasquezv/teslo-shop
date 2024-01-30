import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);
    if (!existsSync(path))
      throw new BadRequestException(`File with name: ${imageName} not found`);
    return path;
  }
}
