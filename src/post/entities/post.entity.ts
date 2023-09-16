import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Populated } from 'src/core/utils/types';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Post extends Document {
  @Prop()
  description: string;

  //TODO : add multi images
  @Prop()
  postImageUrl: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  author: Populated<User>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
