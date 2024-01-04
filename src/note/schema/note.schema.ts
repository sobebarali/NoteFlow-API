import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  keywords: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  sharedWith: Types.Array<Types.ObjectId>;
}
export const NoteSchema = SchemaFactory.createForClass(Note);
