import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Note } from '../../note/schema/note.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Note' }] })
  notes: Note[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  sharedWith: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
