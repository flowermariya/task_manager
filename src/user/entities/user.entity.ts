import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseSchema } from 'src/base.schema';
import { Role } from 'src/enum';
import { Task } from 'src/task/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseSchema {
    @ApiProperty({ description: 'The unique identifier of the user', example: 'e1d9b7a4-2e91-4fa6-b741-2bb71f7f83da' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @Column()
    name: string;

    @ApiProperty({ description: 'The email of the user', example: 'john@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: 'The hashed password of the user', example: '$2b$10$...' })
    @Column()
    @Exclude()
    password: string;

    @ApiProperty({ description: 'The role of the user', enum: Role, example: Role.User })
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @OneToMany(() => Task, (task) => task.createdBy)
    createdTasks: Task[];

    @OneToMany(() => Task, (task) => task.assignedTo)
    assignedTasks: Task[];
}
