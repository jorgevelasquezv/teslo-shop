import { IsString, MinLength } from 'class-validator';

export class NewMessagesDto {
  @IsString()
  @MinLength(1)
  message: string;
}
