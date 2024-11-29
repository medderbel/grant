import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly FirstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly LastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
