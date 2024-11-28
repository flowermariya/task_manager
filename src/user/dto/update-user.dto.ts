import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
    @IsString({ message: 'Name must be a string' })
    @IsOptional()
    name: string;

    @ApiPropertyOptional({ description: 'User password', example: 'securepassword' })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
