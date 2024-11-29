import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/mongoose/database/database.module';
import { UserModule } from './components/user/user.module';
import { CoordinateModule } from './components/user/pages/coordinates/coordinates.module';
import { EmailModule } from './common/email/email.module';
import { AdminModule } from './components/admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CoordinateModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
