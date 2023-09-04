import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions } from 'src/core/interfaces/ipagination.option';
import { Pagination } from 'src/core/interfaces/pagination';
import { paginateModel } from 'src/core/utils/pagination-utils';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  create(user: User, createPostDto: CreatePostDto) {
    const createdPost = this.postModel.create({
      ...createPostDto,
      author: user,
    });

    return createdPost;
  }

  async paginate(
    options: IPaginationOptions,
    username?: string,
  ): Promise<Pagination<Post>> {
    return paginateModel(this.postModel, options, { path: 'author' });
  }

  findAll() {
    const posts = this.postModel.find({});
    return posts;
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findById(id);
      if (!post) throw new NotFoundException(`post with id ${id} not found`);
      return post;
    } catch (err) {
      throw new NotFoundException(`post with id ${id} not found`);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async remove(id: string) {
    const foundPost = await this.findOne(id);
    return foundPost.deleteOne();
  }
}
