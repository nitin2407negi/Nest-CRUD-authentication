import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/common/entities/user.entity';
import { UpdateuserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/list-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put('update-user/:userId')
  async updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateuserDto: UpdateuserDto,
  ): Promise<Partial<User>> {
    console.log(updateuserDto);
    return this.userService.updateUser(userId, updateuserDto);
  }

  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get('get-user-byId/:userId')
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserbyId(userId);
  }

  @Post('list-users')
  async listUsers(@Body() userListDto: UserListDto) {
    return this.userService.listAllUser(userListDto);
  }
}
