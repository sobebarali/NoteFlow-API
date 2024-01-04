import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/users.schema';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop()
  keywords: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  sharedWith: User[];
}
export const NoteSchema = SchemaFactory.createForClass(Note);
