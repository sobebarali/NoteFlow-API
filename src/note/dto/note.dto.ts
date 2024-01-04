import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsString({ each: true })
  readonly keywords?: string[];
}


export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsString({ each: true })
  readonly keywords?: string[];
}