import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/user/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const { email, name, password, role } = createUserDto
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      const res = await this.userRepository.save(user);
      const result: UserDto = {
        id: res.id,
        email: res.email,
        name: res.name,
        role: res.role
      }
      return result
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async fetchUsers(): Promise<UserDto[]> {
    try {
      const users = await this.userRepository.find();
      console.log('users', users);

      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async fetchUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);

      return plainToInstance(UserDto, savedUser);
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.userRepository.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
