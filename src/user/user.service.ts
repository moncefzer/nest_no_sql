import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IPaginationOptions } from '../core/interfaces/ipagination.option';
import { Pagination } from '../core/interfaces/pagination';
import { paginateModel } from '../core/utils/pagination-utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(user);
      delete createdUser.password;
      return createdUser;
    } catch (err) {
      if (err.code === 11000)
        throw new BadRequestException('Email already used');
      throw err;
    }
  }

  // findAll(): Promise<User[]> {
  //   return this.userModel.find();
  // }

  async paginate(
    options: IPaginationOptions,
    username?: string,
  ): Promise<Pagination<User>> {
    return paginateModel(this.userModel, options);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User Not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    //TODO : implement updateUser
    const user = await this.findOne(id);
    return user;
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id);
    await this.userModel.deleteOne({ id });
    return `User ${id} Deleted Succ`;
  }

  findByMail(email: string, selectPass?: boolean): Promise<User> {
    return this.userModel.findOne(
      { email },
      { password: selectPass, email: true, _id: true },
    );
  }
}
