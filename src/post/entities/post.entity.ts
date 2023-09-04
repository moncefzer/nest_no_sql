import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Post {
  _id?: Types.ObjectId;

  @Prop()
  description: string;

  //TODO : add multi images
  @Prop()
  postImageUrl: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
