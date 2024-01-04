import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const user = await this.userModel.findById(userId, '-password').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const notes = await this.noteModel.find({ createdBy: userId }).exec();

    return notes;
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const user = await this.userModel.findById(userId, '-password').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let createDoc = {
      ...createNoteDto,
      createdBy: user._id,
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

  async shareNote(
    noteId: string,
    ownerId: string,
    userId: string,
  ): Promise<Note> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    if (note.createdBy.toString() !== ownerId) {
      throw new ForbiddenException(
        "You don't have permission to share this note",
      );
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    note.sharedWith.push(user._id);
    await note.save();
    return note;
  }

  async searchNotes(query: string, userId: string): Promise<Note[]> {
    return this.noteModel
      .find({
        createdBy: userId,
        keywords: { $in: [new RegExp(query, 'i')] },
      })
      .exec();
  }
}
