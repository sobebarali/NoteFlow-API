import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schema/note.schema';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { User, UserDocument } from '../users/schema/users.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(userId: string): Promise<Note[]> {
    return this.noteModel.find({ createdBy: userId }).exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    let createDoc = {
      ...createNoteDto,
      createdBy: userId,
    };

    const createdNote = new this.noteModel(createDoc);
    const note = await createdNote.save();

    // Add the note to the user's notes array
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { notes: note._id },
    });

    return note;
  }

  async delete(id: string): Promise<void> {
    let note = await this.noteModel.findByIdAndDelete(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return;
  }
  async deleteAll(): Promise<any> {
    return this.noteModel.deleteMany({}).exec();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();
  }
}
