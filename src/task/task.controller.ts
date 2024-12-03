import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskDto } from './dto/task.dto';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role, TaskStatus } from 'src/enum';

@ApiBearerAuth()
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskDto,
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<TaskDto> {
    const currentUser = req.user;
    return await this.taskService.createTask(createTaskDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all tasks' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status',
    enum: TaskStatus,
  })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskDto] })
  async fetchTasks(
    @Request() req,
    @Query('status') status?: TaskStatus,
  ): Promise<TaskDto[]> {
    const currentUser = req.user;
    return await this.taskService.fetchTasks(status, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a task by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the task' })
  @ApiResponse({ status: 200, description: 'Task details', type: TaskDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async fetchTaskById(@Param('id') id: string): Promise<TaskDto> {
    return await this.taskService.fetchTaskById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to update' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ): Promise<TaskDto> {
    const currentUser = req.user;
    return await this.taskService.updateTask(id, updateTaskDto, currentUser);
  }

  @Patch(':id/assign')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({
    status: 200,
    description: 'Task assigned successfully',
    type: TaskDto,
  })
  @ApiResponse({ status: 404, description: 'Task or User not found' })
  async assignTask(
    @Param('id') taskId: string,
    @Query('assignedTo') assignedTo: string,
    @Request() req: any,
  ): Promise<TaskDto> {
    const currentUser = req.user;
    return this.taskService.assignTask(taskId, assignedTo, currentUser);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to delete' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const currentUser = req.user;
    return await this.taskService.deleteTask(id, currentUser);
  }
}
