import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from '../entities/room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { CreateRoomDto } from '../dto';

@Injectable()
class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async create(admin: User, createRoomDto: CreateRoomDto) {
    //? add group creator  (admin) to the room users
    createRoomDto.users.push(admin._id.toString());
    const createdRoom = await this.roomModel.create(createRoomDto);
    return await this.findOneWithPopUsers(createdRoom._id.toString());
  }

  // async paginate(
  //   options: IPaginationOptions,
  //   username?: string,
  // ): Promise<Pagination<Post>> {
  //   return paginateModel(this.roomModel, options, { path: 'author' });
  // }

  findRoomsForUser(user: User) {
    const rooms = this.roomModel.find({ users: { $in: [user._id] } });
    return rooms;
  }

  async findOneWithPopUsers(id: string) {
    try {
      const room = await this.roomModel.findById(id).populate('users');
      if (!room) throw new NotFoundException(`room with id ${id} not found`);
      return room;
    } catch (err) {
      throw new NotFoundException(`room with id ${id} not found`);
    }
  }

  // async update(id: string, updatePostDto: UpdatePostDto) {
  //   await this.findOne(id);
  //   return this.roomModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  // }

  // async remove(id: string) {
  //   const foundPost = await this.findOne(id);
  //   return foundPost.deleteOne();
  // }
}

export default RoomService;
