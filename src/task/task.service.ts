import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { plainToInstance } from 'class-transformer';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Role, TaskStatus } from 'src/enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  // Create a new task
  async createTask(
    createTaskDto: CreateTaskDto,
    currentUser: User,
  ): Promise<TaskDto> {
    try {
      const { assignedTo, ...taskData } = createTaskDto;

      const creator = await this.userService.fetchUserById(currentUser.id);

      let user: User | null = null;
      if (assignedTo) {
        user = await this.userService.fetchUserById(assignedTo);
      }

      const task = this.taskRepository.create({
        ...taskData,
        createdBy: creator,
        assignedTo: user,
      });

      const savedTask = await this.taskRepository.save(task);
      return plainToInstance(TaskDto, savedTask);
    } catch (error) {
      console.error('Unexpected error from createTask:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async fetchTasks(status?: TaskStatus, currentUser?: any): Promise<TaskDto[]> {
    try {
      const findOptions: any = {
        relations: ['createdBy', 'assignedTo'],
      };

      if (status) {
        findOptions.where = { status };
      }

      if (currentUser.role === 'User') {
        findOptions.where = {
          ...findOptions.where,
          assignedTo: { id: currentUser.userId },
        };
      }

      const tasks = await this.taskRepository.find(findOptions);
      console.log('Fetched Tasks:', tasks);

      return plainToInstance(TaskDto, tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  async fetchTaskById(id: string): Promise<TaskDto> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return plainToInstance(TaskDto, task);
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    currentUser: any,
  ): Promise<TaskDto> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['createdBy', 'assignedTo'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const { assignedTo, ...updateData } = updateTaskDto;

      if (currentUser.role === Role.Admin) {
        if (task.createdBy.id !== currentUser.id) {
          throw new ForbiddenException(
            `Admin is not allowed to update tasks they did not create`,
          );
        }
        if (assignedTo) {
          const user = await this.userService.fetchUserById(assignedTo);
          task.assignedTo = user;
        }
        Object.assign(task, updateData);
      } else if (currentUser.role === Role.User) {
        if (task.assignedTo.id !== currentUser.userId) {
          throw new ForbiddenException(
            `User is not allowed to update tasks not assigned to them`,
          );
        }
        const allowedUpdates = ['deadline', 'status'];
        Object.keys(updateData).forEach((key) => {
          if (!allowedUpdates.includes(key)) {
            throw new ForbiddenException(
              `Users are not allowed to update the ${key} field`,
            );
          }
        });
        Object.assign(task, updateData);
      }

      const updatedTask = await this.taskRepository.save(task);
      return plainToInstance(TaskDto, updatedTask);
    } catch (error) {
      console.error('Unexpected error during task update:', error);
      throw error;
    }
  }

  async deleteTask(id: string, currentUser: any): Promise<{ message: string }> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id, createdBy: currentUser.userId },
      });
      if (!task) {
        throw new NotFoundException(
          `Task with ID ${id} not found or not authorized to delete`,
        );
      }

      await this.taskRepository.remove(task);
      return { message: `Task with ID ${id} deleted successfully` };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
