import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'src/enum';

export class TaskDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description?: string;

    @ApiProperty({ description: 'The role of the user', enum: TaskStatus, example: TaskStatus.Created })
    status: TaskStatus;

    @ApiProperty({ description: 'The role of the user', enum: TaskPriority, example: TaskPriority.Low })
    priority: TaskPriority;

    @ApiProperty()
    deadline?: Date;

    @ApiProperty()
    createdBy: {
        id: string;
        name: string;
        email: string;
    };

    @ApiProperty()
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    };

    @Exclude()
    notes: string; // Exclude sensitive fields if necessary
}
