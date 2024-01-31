import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, AuthModule],
})
export class FilesModule {}
