import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'src/common/email/email.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user.service';
import { Userprovider } from './user.provider';
import { DatabaseModule } from 'src/common/mongoose/database/database.module';
import { EmailService } from 'src/common/email/email.service';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { AdminService } from '../admin/admin.service';
import { Adminprovider } from '../admin/admin.provider';

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
    AuthService,
    UserService,
    EmailService,
    JwtStrategy,
    AdminService,
    ...Userprovider,
    ...Adminprovider,
  ],
  controllers: [AuthController],
  exports: [AuthService, ...Userprovider],
})
export class UserModule {}
