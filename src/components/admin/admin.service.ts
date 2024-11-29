import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ICreateAdmin, IEditAdmin } from 'src/common/interfaces/admin';
import { Admin } from 'src/common/mongoose/models/admin';
import { ADMIN_PROVIDER } from 'src/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @Inject(ADMIN_PROVIDER)
    private readonly adminModel: Model<Admin>,
  ) { }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async getAdminByMail(email: string): Promise<Admin> {
    return await this.adminModel.findOne({
      email,
      isArchived: false,
      isDeleted: false,
    });
  }
  async getAdminById(id: string): Promise<Admin> {
    return this.adminModel.findById(id, {
      isDeleted: false,
      isArchived: false,
    });
  }

  async createAdmin(payload: ICreateAdmin): Promise<Admin> {
    return await this.adminModel.create(payload);
  }
  async updateAdmin(admin: IEditAdmin): Promise<Admin> {
    return await this.adminModel
      .findByIdAndUpdate(
        admin._id,
        {
          $set: { ...admin },
        },
        { new: true },
      )
      .exec();
  }
  async deleteUserById(id: string): Promise<Admin> {
    return await this.adminModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
  }
  async archiveActiveUserById(id: string, isArchived: boolean): Promise<Admin> {
    console.log('User ID:', id);
    const user = await this.adminModel.findByIdAndUpdate(
      id,
      { $set: { isArchived } },
      { new: true },
    );
    console.log('Archived User:', user);
    return user;
  }
}
