import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/base.schema';
import { TaskPriority, TaskStatus } from 'src/enum';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task extends BaseSchema {
    @ApiProperty({ description: 'The unique identifier of the user', example: 'e1d9b7a4-2e91-4fa6-b741-2bb71f7f83da' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ description: 'The role of the user', enum: TaskStatus, example: TaskStatus.Created })
    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.Created,
    })
    status: TaskStatus;

    @ApiProperty({ description: 'The role of the user', enum: TaskPriority, example: TaskPriority.Low })
    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.Low,
    })
    priority: TaskPriority;

    @ManyToOne(() => User, (user) => user.createdTasks, { nullable: false })
    createdBy: User;

    @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
    assignedTo: User;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ type: 'text', nullable: true })
    notes: string; // Optional field for comments/notes
}
