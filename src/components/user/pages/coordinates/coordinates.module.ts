import { DatabaseModule } from 'src/common/mongoose/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { Coordinateprovider } from './coordinates.provider';
import { CoordinateService } from './coordinates.service';
import { CoordinateController } from './coordinates.controller';
import { EmailModule } from 'src/common/email/email.module';
import { FileService } from 'src/components/file/file.service';
import { FileProvider } from 'src/components/file/file.provider';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'refresh'] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    EmailModule,
  ],
  providers: [
    CoordinateService,
    ...Coordinateprovider,
    FileService,
    ...FileProvider,
  ],
  exports: [CoordinateService, ...Coordinateprovider],
  controllers: [CoordinateController],
})
export class CoordinateModule {}
