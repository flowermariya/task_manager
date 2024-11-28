import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { TaskPriority } from 'src/enum';

export class CreateTaskDto {
    @ApiProperty({ description: 'Task title', example: 'Complete Documentation' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Task description', example: 'Write the API documentation' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'The role of the user', enum: TaskPriority, example: TaskPriority.Low })
    @IsOptional()
    priority: TaskPriority;

    @ApiProperty({ description: 'Task deadline', example: '2024-12-31T23:59:59Z' })
    @IsOptional()
    deadline?: Date;

    @ApiProperty({ description: 'Assigned user ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    assignedTo?: string;
}
