import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/common/mongoose/database/database.module';
import { FileService } from './file.service';
import { FileProvider } from './file.provider';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({ dest: './uploads/' }),
    PassportModule.register({ defaultStrategy: ['jwt', 'refresh'] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  providers: [FileService, ...FileProvider],
  exports: [FileService, ...FileProvider],
})
export class FileModule {}
