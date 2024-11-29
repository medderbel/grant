import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { join } from 'path';
import { FILE_PROVIDER } from 'src/config';

@Injectable()
export class FileService {
  constructor(@Inject(FILE_PROVIDER) private readonly fileModel: Model<File>) {}
  async createFile(file: Express.Multer.File): Promise<File> {
    const fileType = file.mimetype.split('/')[0];
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(process.cwd(), 'uploads', fileType);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const newFile = new this.fileModel({
      name: fileName,
      size: file.size,
      path: join(filePath, fileName),
    });

    return newFile.save();
  }
}
