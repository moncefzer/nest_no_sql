import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: [true, 'username is required '] })
  username: string;

  @Prop({ unique: true, required: [true, 'email is required'] })
  email: string;

  @Prop({ select: false, required: [true, 'pass is required '] })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre('save', function (next) {
//   next();
// });
