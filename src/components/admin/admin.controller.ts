import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { openApiResponse } from 'src/common/decorator/openApi.decorator';
import { Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { AdminDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { FileService } from '../file/file.service';
import { LoginDto } from '../user/auth/dto';
import { AuthService } from '../user/auth/auth.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) { }
  @Post('/create')
  @openApiResponse(
    {
      status: HttpStatus.CREATED,
      description: 'Admin created successfuly !',
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong!',
    },
    {
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed to create admin. Check your request payload.',
    },
  )
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
  async createAdmin(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() createAdminDto: AdminDto,
  ) {
    try {
      if (!file || !createAdminDto) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid file or request payload',
        });
      }

      const cryptedPassword = await this.authService.hashPassword(
        createAdminDto.password,
      );

      const createdFile = await this.fileService.createFile(file);
      if (!createdFile) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File not uploaded!',
        });
      }

      const createdAdmin = await this.adminService.createAdmin({
        image: createdFile['_id'],
        ...createAdminDto,
        password: cryptedPassword,
      });

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: 'Admin created successfully!',
        admin: createdAdmin,
      });
    } catch (err) {
      console.error('Error creating admin:', err.message, err.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        error: err.message,
      });
    }
  }
  @Post('login')
  @ApiBody({ type: LoginDto })
  @openApiResponse(
    {
      status: HttpStatus.OK,
      description: 'accessToken & refreshToken has been returned!',
    },
    { status: HttpStatus.UNAUTHORIZED, description: 'unothorized!' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'something went wrong!',
    },
  )
  public async login(@Res() res: Response, @Body() body: LoginDto) {
    try {
      const { email, password } = body;
      const admin = await this.adminService.getAdminByMail(email);
      const verifPassword = await this.authService.decodeAdminPassword(
        admin,
        password,
      );
      if (!admin || !verifPassword) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'unothorized',
        });
      }
      const { accessToken, refreshToken } =
        await this.authService.generateAdminToken(admin);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        admin: admin,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err,
      });
    }
  }

  @Delete('/deleteuser/:id')
  @openApiResponse(
    {
      status: HttpStatus.OK,
      description: 'User deleted successfully!',
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong!',
    },
    {
      status: HttpStatus.NOT_FOUND,
      description: 'User not found.',
    },
  )
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    try {
      const deletedUser = await this.adminService.deleteUserById(id);

      if (!Types.ObjectId.isValid(id)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found.',
        });
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully!',
        user: deletedUser,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: err.message,
      });
    }
  }

  @Put('/archive/:id')
  @openApiResponse(
    {

      status: HttpStatus.OK,
      description: 'User archived successfully!',
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong!',
    },
    {
      status: HttpStatus.NOT_FOUND,
      description: 'User not found.',
    },
  )
  @ApiOperation({ summary: 'Archive user' })
  async archiveUser(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!isValidObjectId(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid user ID format',
        });
      }
      const archivedUser = await this.adminService.archiveActiveUserById(
        id,
        true,
      );

      if (!archivedUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found.',
        });
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User archived successfully!',
        user: archivedUser,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: err.message,
      });
    }
  }

  @Put('/activate/:id')
  @openApiResponse(
    {
      status: HttpStatus.OK,
      description: 'User activated successfully!',
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Something went wrong!',
    },
    {
      status: HttpStatus.NOT_FOUND,
      description: 'User not found.',
    },
  )
  @ApiOperation({ summary: 'Activate user' })
  async activeUser(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!isValidObjectId(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid user ID format',
        });
      }
      const activatedUser = await this.adminService.archiveActiveUserById(
        id,
        false,
      );

      if (!activatedUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found.',
        });
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User activated successfully!',
        user: activatedUser,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: err.message,
      });
    }
  }
}
