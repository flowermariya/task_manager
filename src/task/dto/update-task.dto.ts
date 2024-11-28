import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID, IsDateString } from 'class-validator';

export class UpdateTaskDto {
    @ApiProperty({ description: 'The title of the task', example: 'Update documentation', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'The description of the task', example: 'Modify API documentation as per feedback', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'The priority of the task', enum: ['Low', 'Medium', 'High'], example: 'High', required: false })
    @IsOptional()
    @IsEnum(['Low', 'Medium', 'High'])
    priority?: 'Low' | 'Medium' | 'High';

    @ApiProperty({ description: 'The status of the task', enum: ['Pending', 'InProgress', 'Completed'], example: 'InProgress', required: false })
    @IsOptional()
    @IsEnum(['Pending', 'InProgress', 'Completed'])
    status?: 'Pending' | 'InProgress' | 'Completed';

    @ApiProperty({ description: 'The user ID to whom the task is reassigned', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    @IsOptional()
    @IsUUID()
    assignedTo?: string;

    @ApiProperty({ description: 'The deadline for the task', example: '2025-01-15T23:59:59Z', required: false })
    @IsOptional()
    @IsDateString()
    deadline?: string;
}
