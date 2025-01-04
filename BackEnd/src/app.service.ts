import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // Create a new user
  async create(data: any): Promise<UserDocument> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  // Find a single user by condition
  async findOne(condition: any): Promise<UserDocument | null> {
    return this.userModel.findOne(condition).exec();
  }
}
