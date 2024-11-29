import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: process.env.SMTP_USERNAME,
      },
      template: {
        dir: __dirname + '/../../../view',
        adapter: new HandlebarsAdapter(),
        options: {
          allowProtoMethodsByDefault: true,
          allowProtoPropertiesByDefault: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService, MailerModule],
})
export class EmailModule {}
