import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  conversationName: string;

  @IsNotEmpty()
  @IsArray()
  participants: string[];

  @IsNotEmpty()
  @IsString()
  message: string;
}
