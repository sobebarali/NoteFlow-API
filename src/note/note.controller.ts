import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NoteService } from './note.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  async findAll(@Request() req) {
    let userId = req.user._id.toString();
    return this.noteService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.noteService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    let userId = req.user._id.toString();
    return await this.noteService.create(createNoteDto, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.noteService.delete(id);
  }
}
