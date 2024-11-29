import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/common/mongoose/database/database.module';
import { UserService } from '../user/user.service';
import { Userprovider } from '../user/user.provider';
import { Adminprovider } from './admin.provider';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { FileService } from '../file/file.service';
import { FileProvider } from '../file/file.provider';
import { AuthService } from '../user/auth/auth.service';
import { AuthController } from '../user/auth/auth.controller';
import { EmailService } from 'src/common/email/email.service';
import { EmailModule } from 'src/common/email/email.module';

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
    AdminService,
    AuthService,
    FileService,
    UserService,
    EmailService,
    ...Adminprovider,
    ...FileProvider,
    ...Userprovider,
  ],
  exports: [AdminService, AuthService, ...Adminprovider],
  controllers: [AdminController, AuthController],
})
export class AdminModule { }
