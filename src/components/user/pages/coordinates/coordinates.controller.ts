import {
  Controller,
  Body,
  UseInterceptors,
  InternalServerErrorException,
  Post,
  Res,
  UploadedFile,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoordinateService } from './coordinates.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { openApiResponse } from 'src/common/decorator/openApi.decorator';
import { CoordinatesDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { EmailService } from 'src/common/email/email.service';
import { JwtAuthGuard } from 'src/common/strategy/jwt-auth.guard';
import { FileService } from 'src/components/file/file.service';

@ApiTags('coordinate')
@Controller('coordinate')
export class CoordinateController {
  constructor(
    private readonly fileService: FileService,
    private readonly coordinateService: CoordinateService,
    private readonly emailService: EmailService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @openApiResponse(
    {
      status: HttpStatus.CREATED,
      description: 'Coordinates created successfuly !',
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong!',
    },
    {
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed to create coordinates. Check your request payload.',
    },
  )
  @ApiOperation({ summary: 'Upload file and create coordinate' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const fileType = file.mimetype.split('/')[0];
          const uploadPath = `./uploads/${fileType}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async createCoordinate(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() CreateCoordinateDto: CoordinatesDto,
    @Req() req: any,
  ) {
    try {
      0
      if (!file || !file.originalname || !CreateCoordinateDto) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid file or request payload',
        });
      }

      console.log('Uploaded file:', file);
      const userId = req.user.id;
      const createdFile = await this.fileService.createFile(file);

      if (!createdFile) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File not uploaded!',
        });

      }

      const createdCoordinate = await this.coordinateService.createCoordinate({
        image: createdFile['_id'],
        ...CreateCoordinateDto,
        name: 'resumee',
        user: userId,
      });

      try {
        await this.emailService.sendEmail({
          to: CreateCoordinateDto.email,
          subject: 'Coordinate Created',
          template: './email/coordinate-created',
          context: {
            firstName: CreateCoordinateDto.FirstName,
          },
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message:
          'Coordinate created successfully, and confirmation email sent!',
        coordinate: createdCoordinate,
      });
    } catch (err) {
      console.error('Error creating coordinate:', err.message, err.stack);
      throw new InternalServerErrorException({ 
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'Something went wrong',
      });
    }
  }
}
