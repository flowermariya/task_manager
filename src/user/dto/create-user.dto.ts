import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/enum';
import { IsOptional } from '@nestjs/class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @ApiProperty({ description: 'User password', example: 'securepassword' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @ApiPropertyOptional({ description: 'The role of the user', enum: Role, example: Role.User })
    @IsOptional()
    role: Role;
}