import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { ResponseCreateUserDto } from './dto/response-create-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserDto): Promise<ResponseCreateUserDto> {
    const userExists = await this.usersService.findByEmail(user.email);

    if (userExists) {
      throw new BadRequestException('Invalid Credentials', 'BadRequest');
    }

    const userCreated = await this.usersService.create(user);

    const responseDto: ResponseCreateUserDto = {
      id: userCreated.id.toString(),
      name: userCreated.name,
      email: userCreated.email,
      createdAt: userCreated.createdAt.toString(),
      updatedAt: userCreated.updatedAt
        ? userCreated.updatedAt.toString()
        : undefined,
      deletedAt: userCreated.deletedAt
        ? userCreated.deletedAt.toString()
        : undefined,
    };

    return responseDto;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found', 'UserNotFound');
      }
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.update(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found', 'UserNotFound');
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.usersService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found', 'UserNotFound');
      }
      throw error;
    }
  }
}
