import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'Upwork Account 1', description: 'Name for the account' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.work@example.com', description: 'Email associated with this account' })
  @IsEmail()
  email: string;
}
